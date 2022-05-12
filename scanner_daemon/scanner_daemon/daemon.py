import os
import sys
import django
import time

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR) + '/scanner_backend/')
sys.path.append(str(BASE_DIR) + '/scanner_daemon/')
os.environ['DJANGO_SETTINGS_MODULE'] = 'management.settings'
os.environ['DJANGO_ALLOW_ASYNC_UNSAFE'] = 'true'
django.setup()

from _web3_wrapper import *
from scanner_backend.models import *


def _create_transaction_record(confirmed_block_number, trx_data, receipt,
                               related_sender=None, related_recipient=None):
    print(f'trx detected in block #{confirmed_block_number}')
    transaction = Transaction()
    transaction.setup_data(trx_data, receipt, related_sender=related_sender, related_recipient=related_recipient)
    transaction.save()
    print(f'Transaction {trx_data["hash"]} saved. Block Number: {confirmed_block_number}')


def simple_scanner_daemon():
    """
    최근 생성된 블록에 특정 address가 포함된 트랜잭션이 있는지 검사 후 Transaction 레코드를 DB에 저장 (+ DerivedAddress 객체와 연결)
    """
    confirm_depth = 5  # 최소 5개의 블록에 의해 confirm된 블록만 검사

    latest_block_number = get_latest_block_number()
    print(f'latest block: {latest_block_number}')
    block_number_tracker = latest_block_number

    print('-------------------- daemon initiated --------------------')

    # 놓치는 블록이 없도록 최신 블록 넘버를 최초 1회 받아온 후 블록 넘버를 +1씩 하며 블록에 포함된 트랜잭션 검사
    while True:

        confirmed_block_number = block_number_tracker - confirm_depth
        try:
            trx_list = get_transactions_from_block(confirmed_block_number, data_format='str')
            block_number_tracker += 1
            wallets = DerivedWallet.objects.all()  # 지갑 주소 불러오기
            address_list = [wallet.address for wallet in wallets]

        except BlockNotFound:  # block_number_tracker에 해당하는 Block이 아직 생성되지 않은 경우
            print(f"Block #{block_number_tracker} is not yet created.")
            time.sleep(0.1)
            continue

        # 새로운 최신 블록이 detect되면 7개 이전의 블록으로 검증
        print(f'confirmed: {confirmed_block_number}')
        if trx_list is None:
            print('trx_list is None')
            continue
        for trx in trx_list:  # 트랜잭션 리스트 순회  # TODO 멀티프로세싱
            trx_data = get_transaction(trx, data_format='str')  # dictionary
            if not trx_data:
                print('trx_data is None')
                continue
            receipt = get_transaction_receipt(trx, data_format='str')  # TODO Transaction.setup_data 비동기 처리
            if receipt is None:
                print('receipt is None')

            trx_from = trx_data['from']
            trx_to = trx_data['to']

            for address in address_list:  # 주소 리스트 순회
                # print(f'value of address: {address}, type: {type(address)}')

                if trx_from == address:
                    _create_transaction_record(confirmed_block_number, trx_data, receipt,
                                               related_sender=address, related_recipient=None)

                if trx_to == address:
                    _create_transaction_record(confirmed_block_number, trx_data, receipt,
                                               related_sender=None, related_recipient=address)

        print(f'for loop DONE. Number of trxs: {len(trx_list)}\n')


simple_scanner_daemon()

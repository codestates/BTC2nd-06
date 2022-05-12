import os
import sys
from pathlib import Path
import time

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR) + '/scanner_backend/')
sys.path.append(str(BASE_DIR) + '/scanner_daemon/')

from web3_wrapper import *
from scanner_backend.models import *


def simple_scanner_daemon():  # CA or EOA address
    """
    최근 생성된 블록에 특정 address가 포함된 트랜잭션이 있는지 검사 후 Transaction 레코드를 DB에 저장 (+ DerivedAddress 객체와 연결)
    """
    # block_number_tracker = 0
    confirm_depth = 7
    address_list = []  # TODO DB의 모든 주소 데이터를 캐싱

    latest_block_number = get_latest_block_number()
    block_number_tracker = latest_block_number

    wallets = DerivedWallet.objects.all()
    for wallet in wallets:
        address_list.append(wallet.address)  # DerivedWallet (id, address) tuple
    print('-------------------- daemon initiated --------------------')

    # TODO while문 수행 시간이 새 블록 생성 시간보다 짧아야 한다.
    # TODO 현재 방식은 블록을 5개씩 건너뛰는 경우가 발생.
    # Another strategy: 최신 블록 넘버를 최초 1회 받아온 후 Exception 로직으로 넘버를 +1씩 하며 검사
    while True:
        start = time.time()
        # latest_block_number = get_latest_block_number()
        # if latest_block_number <= block_number_tracker:
        #     continue
        #     # return  # TODO while문으로 구현 시 continue
        # else:
        #     block_number_tracker = latest_block_number
        #     print(block_number_tracker)

        confirmed_block_number = block_number_tracker - confirm_depth
        try:
            trx_list = get_transactions_from_block(confirmed_block_number, data_format='str')
            block_number_tracker += 1
        except BlockNotFound:  # Block이 아직 생성되지 않은 경우
            print(f"Block #{block_number_tracker} is not yet created.")
            continue

        # 새로운 최신 블록이 detect되면 7개 이전의 블록으로 검증
        print(f'confirmed: {confirmed_block_number}')
        for trx in trx_list:  # 트랜잭션 리스트 순회
            trx_data = get_transaction(trx, data_format='str')  # dictionary
            receipt = get_transaction_receipt(trx, data_format='str')  # TODO HTTP 통신 및 Transaction.setup_data 비동기 처리

            trx_from = trx_data['from']
            # print(f'value of trx_from: {trx_from}, type: {type(trx_from)}')
            trx_to = trx_data['to']

            for address in address_list:  # 주소 리스트 순회
                # print(f'value of address: {address}, type: {type(address)}')
                if trx_from == address:
                    print(f'trx detected in block #{confirmed_block_number}')
                    transaction = Transaction()
                    transaction.setup_data(trx_data, receipt, related_sender=address)
                    transaction.save()
                    print(f'Transaction {trx_data["hash"]} saved. Block Number: {confirmed_block_number}')
                    end = time.time()
                    print(f'time elapsed: {start - end} secs.')
                elif trx_to == address:
                    print(f'trx detected in block #{confirmed_block_number}')
                    transaction = Transaction()
                    transaction.setup_data(trx_data, receipt, related_recipient=address)
                    transaction.save()
                    print(f'Transaction {trx_data["hash"]} saved. Block Number: {confirmed_block_number}')
                    end = time.time()
                    print(f'time elapsed: {start - end} secs.')
                else:
                    continue
        print(f'for loop DONE. Number of trxs: {len(trx_list)}\n')


def transaction_confirm_scanner():
    # TODO Confirmation depth 설정
    trx_hash = input('트랜잭션 해시 입력: ')
    block_marker = 0
    while True:

        latest_block_number = get_latest_block_number()  # TODO 마커로 마지막 스캔한 블록 저장해두고 그 다음 블록부터 스캔하는 로직
        if block_marker != latest_block_number:
            block_marker = latest_block_number
            print(block_marker)
            trx_list = get_transactions_from_block(block_marker, data_format='str')
            if trx_hash in trx_list:
                print(f'Transaction {trx_hash} Confirmed.')
                print(f'Block Number: {block_marker}')
                break
            else:
                print('not included:')
                print(trx_list)
                continue

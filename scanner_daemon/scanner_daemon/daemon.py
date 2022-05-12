from web3_wrapper import *
from scanner_backend.models import *


def simple_scanner_daemon(account_address):  # CA or EOA address
    """
    최근 생성된 블록에 특정 address가 포함된 트랜잭션이 있는지 검사 후 Transaction 레코드를 DB에 저장 (+ DerivedAddress 객체와 연결)
    """

    block_number_tracker = 0
    address_list = []  # TODO DB의 모든 주소 데이터를 캐싱

    wallets = DerivedWallet.objects.all()
    for wallet in wallets:
        address_list.append((wallet.id, wallet.address))  # DerivedWallet (id, address) tuple

    latest_block_number = get_latest_block_number()
    if latest_block_number <= block_number_tracker:
        return  # TODO while문으로 구현 시 continue

    trx_list = get_transactions_from_block(latest_block_number, data_format='str')

    for trx in trx_list:  # 트랜잭션 리스트 순회
        trx_data = get_transaction(trx, data_format='str')  # dictionary
        receipt = get_transaction_receipt(trx, data_format='str')  # TODO HTTP 통신 및 Transaction.setup_data 비동기 처리

        trx_from = trx_data['from']
        trx_to = trx_data['to']

        for address in address_list:  # 주소 리스트 순회
            if trx_from == address:
                transaction = Transaction()
                transaction.setup_data(trx_data, receipt, related_sender=address)
                transaction.save()
            elif trx_to == address:
                transaction = Transaction()
                transaction.setup_data(trx_data, receipt, related_recipient=address)
                transaction.save()
            else:
                continue


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

from web3_wrapper import *
from scanner_backend.models import *


def simple_scanner_daemon(account_address):  # CA or EOA address
    """
    최근 생성된 블록에 특정 address가 포함된 트랜잭션이 있는지 검사
    """
    address_list = []

    wallets = DerivedWallet.objects.all()
    for wallet in wallets:
        address_list.append((wallet.id, wallet.address))  # DerivedWallet (id, address) tuple

    latest_block_number = get_latest_block_number()

    trx_list = get_transactions_from_block(latest_block_number, data_format='str')

    for trx in trx_list:
        trx_data = get_transaction(trx)

        trx_from = trx_data['from']
        trx_to = trx_data['to']

        # TODO 2중 for문 구조 개선
        if trx_from in address_list:
            idx = address_list.index(trx_from)
            transaction = Transaction()
            # transaction = Transaction(related_sender=)  # TODO Related Field 연결
            transaction.setup_data()
            transaction.save()  # TRX 추가
            break

        elif trx_to in address_list:
            print('DONE')
            break

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

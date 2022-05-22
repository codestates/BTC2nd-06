import os
import sys
import django
import time
import multiprocessing as mp

from pathlib import Path
from functools import partial


BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
sys.path.append(str(BASE_DIR) + '/scanner_backend/')
sys.path.append(str(BASE_DIR) + '/scanner_daemon/')
os.environ['DJANGO_SETTINGS_MODULE'] = 'management.settings'
os.environ['DJANGO_ALLOW_ASYNC_UNSAFE'] = 'true'
django.setup()

from _web3_wrapper import *
from scanner_backend.models import *


CONFIRM_DEPTH = 5  # scan blocks that are already confirmed by at least {CONFIRM_DEPTH} blocks.
NUMBER_OF_PROCESSES = 5  # multiprocessing: number of processes in process pool.
BLOCK_NOT_FOUND_SLEEP_TIME = 1  # sleep time in secs.


def _create_transaction_record(confirmed_block_number, trx_data, receipt,
                               related_sender=None, related_recipient=None):
    print(f'trx detected in block #{confirmed_block_number}')
    transaction = Transaction()  # create transaction record in database.
    transaction.setup_data(trx_data, receipt, related_sender=related_sender, related_recipient=related_recipient)
    transaction.save()
    print(f'Transaction {trx_data["hash"]} saved. Block Number: {confirmed_block_number}')


def _run_scanner_task(trx_hash, address_list, confirmed_block_number):
    """Block scanner task assigned to each subprocess.
    Tasks run along transaction hash list in a block data.
    """
    # print(f'PID: {os.getpid()}')
    # print(f'trx hash: {trx_obj["hash"]}')
    trx_data = get_transaction(trx_hash, data_format='str')  # transaction dictionary

    trx_from = trx_data['from']
    trx_to = trx_data['to']

    for address in address_list:  # derived wallet addresses stored in database.

        if address in (trx_from, trx_to):
            receipt = get_transaction_receipt(trx_hash, data_format='str')  # transaction receipt dictionary

            if trx_from == address:
                _create_transaction_record(confirmed_block_number, trx_data, receipt,
                                           related_sender=address, related_recipient=None)

            if trx_to == address:
                _create_transaction_record(confirmed_block_number, trx_data, receipt,
                                           related_sender=None, related_recipient=address)


def simple_scanner_daemon():
    """
    steps:
        1. Check if recently confirmed blocks in network contain transaction
           that wallet addresses in the database are involved.
        2. Create a 'Transaction' record in the database if such transaction is detected.
        3. Connect the 'Transaction' record(or model object) to 'DerivedWallet' model object as a Foreign Key.
    """

    latest_block_number = get_latest_block_number()
    print(f'latest block: {latest_block_number}')
    block_number_tracker = latest_block_number

    print('-------------------- daemon initiated --------------------')

    # use the block_number_tracker so that the daemon doesn't skip any recently created block.
    while True:

        confirmed_block_number = block_number_tracker - CONFIRM_DEPTH

        try:
            trx_list = get_transactions_from_block(confirmed_block_number, data_format='str')
        except BlockNotFound:
            print(f"Block #{block_number_tracker} is not yet created.")
            time.sleep(BLOCK_NOT_FOUND_SLEEP_TIME)  # Wait for a new block to be confirmed.
            continue

        wallets = DerivedWallet.objects.all()  # Retrieves wallet addresses stored in the database.
        address_list = [wallet.address for wallet in wallets]

        print(f'confirmed: {confirmed_block_number}')

        # multiprocessing: handle block-scanning tasks along transaction list parallely using subprocess pool.
        pool = mp.Pool(processes=NUMBER_OF_PROCESSES)
        try:
            pool.map(
                partial(
                    _run_scanner_task,
                    address_list=address_list,
                    confirmed_block_number=confirmed_block_number),
                trx_list)  # arguments delivered by 'partial'.
        except TransactionNotFound:
            print('Transaction Not Found.')  # the transaction is not updated to RPC provider node yet.
            block_number_tracker -= 1  # block tracker rollback

        print(f'for loop DONE. Number of trxs: {len(trx_list)}\n')
        block_number_tracker += 1


if __name__ == '__main__':  # only run in the main process.
    simple_scanner_daemon()

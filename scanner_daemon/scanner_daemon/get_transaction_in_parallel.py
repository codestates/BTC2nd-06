import multiprocessing as mp
import time
import os
from _web3_wrapper import *


def work(trx_hash):
    trx_obj = get_transaction(trx_hash, data_format='str')
    print(f'PID: {os.getpid()}')
    print(f'trx hash: {trx_obj["hash"]}')


if __name__ == '__main__':

    latest_block_number = web3.eth.get_block_number()
    # latest_block_number = 19323219
    confirm_depth = 10

    print(f'latest_block_number: {latest_block_number}')

    marker = 19323000
    # 100개 블록 안의 트랜잭션 목록 저장
    start_0 = time.time()
    trx_hash_list = []
    for marker in range(19323000, 19323101):
        trx_hash_list += get_transactions_from_block(marker, data_format='str')
    end_0 = time.time()
    print(f'DONE building trx_hash_list. Time Elapsed: {end_0 - start_0} secs.')

    time.sleep(5)
    print(f'length of trx_hash_list: {len(trx_hash_list)}')

    # 2) 멀티프로세싱
    start_2 = time.time()
    p = mp.Pool(processes=5)
    p.map(work, trx_hash_list)  # TODO other options?
    end_2 = time.time()
    print(f'\n--------------------------------------------------')
    print(f'\n멀티프로세싱 Time Elapsed: {end_2 - start_2} secs.')
    print(f'\n--------------------------------------------------')

    # 1) 순차 실행
    start_1 = time.time()
    for trx_hash in trx_hash_list:
        work(trx_hash)

    end_1 = time.time()
    print(f'\n--------------------------------------------------')
    print(f'\n순차실행 Time Elapsed: {end_1 - start_1} secs.')
    print(f'\n--------------------------------------------------')


"""
The subprocesses will import (i.e. execute) the main module at start.
You need to insert an if __name__ == '__main__': `guard` in the main module
to avoid creating subprocesses recursively.

=> __name__ == '__main__': guard 밖에서 실행되는 코드는 서브프로세스가 메인 프로세스를 fork
하면서 한 번씩 다 실행이 된다. 주의하기.
"""


"""
[Test 결과]

[1차]
1) 순차 실행: 82.9초
2) 멀티프로세싱(n=5): 6.1초

[2차]
1) 멀티프로세싱(n=5): 24.2초
2) 순차 실행: 62.4초

[3차]
1) 멀티프로세싱(n=5): 40.0초
2) 순차 실행: 130.8초

[4차]
1) 멀티프로세싱(n=5): 5.9초
2) 순차 실행: 36.7초

[5차]
1) 순차 실행: 41.9초
2) 멀티프로세싱(n=5): 4.3초


[오차 원인]
=> 체인 환경에 따라 web3 API 통신 시간의 편차가 매우 큼
=> API 통신 지연(I/O)가 너무 크다.
"""

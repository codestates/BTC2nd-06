import multiprocessing as mp
import time
import os
import math


def work(x):
    print(f'값 {x}에 대한 작업 PID = {os.getpid()}')
    # time.sleep(0.5)  # 작업 딜레이가 없다면 => 순차 실행이 오히려 1,000배 더 빠르다 (이 경우)
    return x * x


# 멀티프로세싱으로 진행하는 경우
# if __name__ == '__main__':
#     print(f'메인 PID: {os.getpid()}')
#     p = mp.Pool(3)  # 3개의 프로세스에 작업들을 돌아가며 적절히 분배함
#     # 그냥 Process() 만들면 하나 생성할 때마다 프로세스가 하나씩 새로 생성됨.
#     start = time.time()
#     print(p.map(work, range(0, 10)))
#     end = time.time()
#
#     print(f'Time Elapsed: {end - start} secs')


# 순차적으로 진행하는 경우
start = time.time()

for _ in range(10):
    print(work(_))

end = time.time()
print(f'Time Elapsed: {end - start} secs')

## Wallet 백엔드 API & 코인 데몬

## 디렉토리 구조
##### Root Directory: /srv/BTC2nd-06/scanner_daemon


**/management**: Django 백엔드 프레임워크를 실행하기 위한 설정 파일/URL 라우터/WSGI 미들웨어 랩퍼

**/scanner_backend**: Django Model(DB 스키마 객체), View(API 엔드포인트) 객체가 정의되어 있는 디렉토리

**/scanner_daemon**: 코인 데몬을 실행하기 위한 환경

- _web3_wrapper.py:
  - web3 API 메서드의 리턴값을 적절히 변환하여 리턴하는 함수 정의
  - 코인 데몬에서 호출하여 사용
- daemon.py:
  - 코인 데몬 스크립트
  - 실시간으로 생성되는 BSC 네트워크의 최신 블록을 스캔하여 블록에 포함된 트랜잭션의 목록 중 sender/recipient가 DB의 Wallet 주소와 일치하면 검증 후 DB에 트랜잭션 저장


## 서버/코인 데몬 실행 커맨드

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart nginx uwsgi coin_daemon
```


## 서버 환경 구성 커맨드

```
$ cd /srv
$ git clone https://github.com/codestates/BTC2nd-06.git
$ cd /srv/BTC2nd-06/scanner_daemon
$ python -m venv venv
$ source /srv/BTC2nd-06/scanner_daemon/venv/bin/activate
$ pip3 install -r requirements.txt

$ sudo cp -f /srv/BTC2nd-06/scanner_daemon/.config/nginx/mysite.conf /etc/nginx/sites-available/mysite.conf
$ sudo ln -sf /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/mysite.conf
$ sudo ln -f /srv/BTC2nd-06/scanner_daemon/.config/uwsgi/uwsgi.service /etc/systemd/system/uwsgi.service
$ sudo ln -f /srv/BTC2nd-06/scanner_daemon/.config/python/coin_daemon.service /etc/systemd/system/coin_daemon.service

$ sudo systemctl daemon-reload
$ sudo systemctl enable nginx uwsgi coin_daemon
$ sudo systemctl restart nginx uwsgi coin_daemon

```

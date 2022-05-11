# 파이썬 표준 함수
import requests
import json
import time

# Django Core
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

# 서드 파티 라이브러리
from rest_framework.response import Response
from rest_framework.views import APIView

# 프로젝트 앱
from scanner_backend.models import MasterWallet, DerivedWallet, Transaction
from scanner_backend.serializers import MasterWalletSerializer, DerivedWalletSerializer


# TODO Exception 처리
# TODO form data validation
# TODO serializer 도입


class MasterWalletCreateView(APIView):
    """ 회원가입 + 지갑 생성
    Node.js 백엔드 서버에서 새로운 mnemonic HD Wallet 니모닉 시드와 주소 목록을 생성하여 Django 백엔드/DB에 POST하는 뷰
    """
    permission_classes = (AllowAny,)

    def post(self, request):

        data = request.data

        username = data['user_id']
        password = data['password']
        mnemonic_seed = data['mnemonic_seed']
        address_list = data['address_list']

        # 회원가입 진행

        registration_api_url = 'http://localhost:8000/auth/registration/'
        headers = {'Content-Type': 'application/json'}
        body_data = {'username': username, 'password1': password, 'password2': password}

        registration_response = requests.post(registration_api_url, headers=headers, data=json.dumps(body_data))
        registration_response_dict = registration_response.json()

        time.sleep(0.1)  # TODO Callback Function으로 전환

        user = User.objects.get(id=registration_response_dict['user']['pk'])

        # MasterWallet 객체 생성
        master_wallet = MasterWallet(user=user, mnemonic_seed=mnemonic_seed)
        master_wallet.save()

        # DerivedWallet 객체 10개 생성
        for address in address_list:
            derived_wallet = DerivedWallet(master_wallet=master_wallet, address=address, wallet_alias='_')
            derived_wallet.save()

        return Response(registration_response_dict)


# TODO access_token을 Authorization 헤더에 담아 보내기
class MasterWalletRetrieveView(APIView):
    """ Master 지갑 메타 정보 조회 (보안 강화)
    Mnemonic seed를 조회하는 뷰
    """
    def get(self, request):
        user = request.user

        master_wallet = MasterWallet.objects.get(user=user)
        mnemonic_seed = master_wallet.mnemonic_seed

        address_list = []

        derived_wallet_queryset = DerivedWallet.objects.filter(master_wallet=master_wallet)
        for derived_wallet in derived_wallet_queryset:
            address_list.append(derived_wallet.address)

        data = {
            'mnemonic_seed': mnemonic_seed,
            'address_list': address_list
        }

        return Response(data)


class DerivedWalletRetrieveView(APIView):
    """ DerivedWallet 정보 조회
    DerivedWallet의 잔고, address 목록, 연관 트랜잭션을 조회하는 뷰
    """

    def get(self, request):
        address = request.data['address']
        try:
            derived_wallet = DerivedWallet.objects.get(address=address)
        except DerivedWallet.DoesNotExist:
            raise Exception

        trx_hash_list = []
        transactions = derived_wallet.transaction_set
        for transaction in transactions:
            trx_hash_list.append(transaction.trx_hash)

        # TODO 리턴 데이터 더 상세하게
        data = {
            'transaction_list': trx_hash_list
        }

        return Response(data)
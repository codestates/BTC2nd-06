# 파이썬 표준 함수
import requests
import json

# Django Core
from django.contrib.auth.models import User

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
    def post(self, request):

        data = request.data

        user_id = data['user_id']
        password = data['password']
        mnemonic_seed = data['mnemonic_seed']
        address_list = data['address_list']

        # 회원가입 진행

        registration_api_url = 'http://localhost:8000/auth/registration/'
        headers = {'Content-Type': 'application/json'}
        body_data = {'username': user_id, 'password1': password, 'password2': password}

        registration_response = requests.post(registration_api_url, headers=headers, data=json.dumps(body_data))
        registration_response_dict = registration_response.json()

        user = User.objects.get(id=registration_response_dict['user']['pk'])

        # MasterWallet 객체 생성
        master_wallet = MasterWallet(user=user, mnemonic_seed=mnemonic_seed)
        master_wallet.save()

        # DerivedWallet 객체 10개 생성
        for address in address_list:
            derived_wallet = DerivedWallet(master_wallet=master_wallet, address=address)
            derived_wallet.save()

        response = Response(registration_response_dict)

        return response


class MasterWalletRetrieveView(APIView):
    """ Master 지갑 메타 정보 조회 (보안 강화)
    Mnemonic seed를 조회하는 뷰
    """


class DerivedWalletRetrieveView(APIView):
    """ DerivedWallet 정보 조회
    DerivedWallet의 잔고, address 목록, 연관 트랜잭션을 조회하는 뷰
    """
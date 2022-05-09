# 파이썬 표준 함수

# 코어 장고

# 서드 파티 라이브러리
from rest_framework.response import Response
from rest_framework.views import APIView

# 프로젝트 앱
from scanner_backend.serializers import MasterWalletSerializer


class MasterWalletCreateView(APIView):
    """ 지갑 생성
    Node.js 백엔드 서버에서 새로운 mnemonic HD Wallet을 생성하여 Django 백엔드/DB에 POST하는 뷰
    """
    def post(self, request):

        # TODO Exception 처리 / API specifications 반영

        serializer = MasterWalletSerializer(data=request.data)
        serializer.save()

        response = Response(serializer.data)

        return response


class MasterWalletRetrieveView(APIView):
    """ Master 지갑 메타 정보 조회 (보안 강화)
    Mnemonic seed를 조회하는 뷰
    """


class DerivedWalletRetrieveView(APIView):
    """ DerivedWallet 정보 조회
    DerivedWallet의 잔고, address 목록, 연관 트랜잭션을 조회하는 뷰
    """
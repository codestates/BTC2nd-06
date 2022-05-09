# 파이썬 표준 함수

# 코어 장고

# 서드 파티 라이브러리
from rest_framework.response import Response
from rest_framework.views import APIView

# 프로젝트 앱
from scanner_backend.serializers import MasterWalletSerializer


class TransactionCreateView(models.APIView):
    pass
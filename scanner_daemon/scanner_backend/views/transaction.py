# 파이썬 표준 함수

# 코어 장고

# 서드 파티 라이브러리
from rest_framework.response import Response
from rest_framework.views import APIView

# 프로젝트 앱
from scanner_backend.serializers import TransactionSerializer


class TransactionCreateView(APIView):

    """ 트랜잭션 생성
    """

    def post(self, request):
        # TODO 지갑에서 트랜잭션을 생성하고 RPC 메서드 호출하는 로직을 Node 서버 / Python 서버 중 어느 곳에서 담당할지 정하기

        serializer = TransactionSerializer(data=request.data)
        serializer.save()

        response = Response(serializer.data)

        return response
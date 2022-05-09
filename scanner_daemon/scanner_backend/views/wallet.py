# 파이썬 표준 함수

# 코어 장고

# 서드 파티 라이브러리
from rest_framework.response import Response
from rest_framework.views import APIView

# 프로젝트 앱
from scanner_backend.serializers import MasterWalletSerializer


class MasterWalletCreateView(APIView):
    """ Node.js 백엔드 서버에서 새로운 mnemonic HD Wallet을 생성하여 Django 백엔드/DB에 POST하는 뷰
    """
    def post(self, request):

        # TODO Exception 처리 / API specifications 반영

        serializer = MasterWalletSerializer(data=request.data)
        serializer.save()

        response = Response(serializer.data)

        return response

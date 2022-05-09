# 파이썬 표준 함수

# 코어 장고

# 서드 파티 라이브러리
from rest_framework import serializers

# 프로젝트 앱
from .models import *


class MasterWalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = MasterWallet
        fields = '__all__'


class DerivedWalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = DerivedWallet
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = '__all__'

# 파이썬 표준 함수
import base64
import datetime
from datetime import timedelta
from urllib.error import HTTPError

# 코어 장고
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.http import Http404
from django.http import HttpRequest
from django.shortcuts import get_object_or_404 as _get_object_or_404
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.urls import reverse, NoReverseMatch

# 서드 파티 라이브러리
from rest_framework import serializers

# 프로젝트 앱
from .models import *


class MasterWalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = MasterWallet
        fields = '__all__'

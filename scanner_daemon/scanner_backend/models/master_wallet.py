# Python 표준 함수
import uuid

# Django Core
from django.db import models
from django.contrib.auth.models import User


class MasterWallet(models.Model):
    """
    HD Wallet based on BIP-44
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')

    mnemonic_seed = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.user.username)  # TODO 회원가입 부분

    # def set_mnemonic_seed(self):
    #     self.mnemonic_seed = generate_mnemonic()
    #     self.save()

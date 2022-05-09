# Python 표준 함수
import uuid

# Django Core
from django.contrib.auth.models import User
from django.db import models


class MasterWallet(models.Model):
    """
    HD Wallet based on BIP-44
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # MySQL table ID
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')
    mnemonic_seed = models.TextField(blank=True, null=True)

    latest_account_index = models.IntegerField(default=0)
    latest_address_index = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

    # def set_mnemonic_seed(self):
    #     self.mnemonic_seed = generate_mnemonic()
    #     self.save()

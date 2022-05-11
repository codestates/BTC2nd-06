# Python 표준 함수
import uuid

# Django Core
from django.db import models


class DerivedWallet(models.Model):
    """
    HD Wallet based on BIP-44
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # MySQL table ID
    master_wallet = models.ForeignKey('MasterWallet', on_delete=models.CASCADE, related_name='master_wallet')

    address = models.TextField(null=True, blank=True)
    wallet_alias = models.CharField(max_length=30, blank=True, null=True)  # 지갑 주소 이름

    balance = models.FloatField(default=0)

    # def __str__(self):
    #     return str(self.address) if self.address else '_'

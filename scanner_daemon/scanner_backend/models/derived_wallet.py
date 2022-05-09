# Python 표준 함수
import uuid

# Django Core
from django.db import models


class DerivedWallet(models.Model):
    """
    HD Wallet based on BIP-44
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # MySQL table ID
    address = models.TextField(null=True, blank=True)

    wallet = models.ForeignKey('MasterWallet', on_delete=models.CASCADE, related_name='master_wallet')
    derivation_path = models.CharField(max_length=50, default="")

    account_index = models.IntegerField(default=0)
    address_index = models.IntegerField(default=0)

    def __str__(self):
        return self.address

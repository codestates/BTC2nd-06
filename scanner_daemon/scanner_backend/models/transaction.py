# Python 표준 함수
import uuid

# Django Core
from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MinLengthValidator


class Transaction(models.Model):
    """
    Transaction Related to HD Wallet Accounts
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trx_hash = models.CharField(default='0x'+'0'*64, max_length=66, validators=[MinLengthValidator(66)])

    related_sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    related_recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipient')

    sender_address = models.CharField(max_length=42, validators=[MinLengthValidator(42)], blank=True, null=True)  # Hash Address
    recipient_address = models.CharField(max_length=42, validators=[MinLengthValidator(42)], blank=True, null=True)

    block_hash = models.CharField(default='0x'+'0'*64, max_length=66, validators=[MinLengthValidator(66)])
    block_number = models.IntegerField(default=0)

    transaction_payload = models.TextField()  # JSON format string

    def __str__(self):
        return self.trx_hash


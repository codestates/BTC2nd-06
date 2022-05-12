# Python 표준 함수
import uuid

# Django Core
from django.db import models
from django.core.validators import MinLengthValidator
from django.utils import timezone

# Project
from .derived_wallet import DerivedWallet


class Transaction(models.Model):
    """
    Transaction Related to HD Wallet Accounts
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trx_hash = models.CharField(default='0x'+'0'*64, max_length=66, validators=[MinLengthValidator(66)])
    block_hash = models.CharField(default='0x'+'0'*64, max_length=66, validators=[MinLengthValidator(66)])
    block_number = models.IntegerField(default=0)

    # TODO DerivedWallet에 연결 검토
    related_sender = models.ForeignKey(DerivedWallet, blank=True, null=True, on_delete=models.CASCADE, related_name='sender')
    related_recipient = models.ForeignKey(DerivedWallet, blank=True, null=True, on_delete=models.CASCADE, related_name='recipient')

    value = models.BigIntegerField(default=0)  # 18 Decimals applied(BNB)
    gas_used = models.BigIntegerField(default=0)

    sender_address = models.CharField(max_length=42, validators=[MinLengthValidator(42)], blank=True, null=True)  # Hash Address
    recipient_address = models.CharField(max_length=42, validators=[MinLengthValidator(42)], blank=True, null=True)

    transaction_payload = models.TextField()  # JSON format string

    created_at = models.DateTimeField(default=timezone.localtime)

    def __str__(self):
        return self.trx_hash

    def setup_data(self, trx_data, receipt, related_sender=None, related_recipient=None):

        self.trx_hash = trx_data['hash']
        self.block_hash = trx_data['blockHash']
        self.block_number = trx_data['blockNumber']
        if related_sender:
            self.value = -1 * trx_data['value']
        elif related_recipient:
            self.value = trx_data['value']
        self.gas_used = receipt['gasUsed']
        self.sender_address = trx_data['from']
        self.recipient_address = trx_data['to']
        self.transaction_payload = str(trx_data)

        if related_sender:
            self.related_sender = DerivedWallet.objects.get(address=related_sender)  # TODO DoesNotExist Exception처리

        if related_recipient:
            self.related_recipient = DerivedWallet.objects.get(address=related_recipient)

        self.save()





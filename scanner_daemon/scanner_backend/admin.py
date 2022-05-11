from django.contrib import admin
from .models import *


class MasterWalletAdmin(admin.ModelAdmin):

    model = MasterWallet
    list_display = ['user']


class DerivedWalletAdmin(admin.ModelAdmin):

    model = DerivedWallet
    list_display = ['master_wallet', 'address', 'balance', 'wallet_alias']


class TransactionAdmin(admin.ModelAdmin):
    model = Transaction
    list_display = ['trx_hash', 'related_sender', 'related_recipient', 'sender_address', 'recipient_address', 'value', 'gas_used']


admin.site.register(MasterWallet, MasterWalletAdmin)
admin.site.register(DerivedWallet, DerivedWalletAdmin)
admin.site.register(Transaction, TransactionAdmin)

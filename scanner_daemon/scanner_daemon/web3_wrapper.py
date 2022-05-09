from web3 import Web3
from web3.datastructures import AttributeDict
from web3.middleware import geth_poa_middleware
from hexbytes import HexBytes
import json
from metadata import Meta

RPC_URL_HTTP = Meta.RPC_URL_HTTP

# WALLET_ADDRESS = Meta.WALLET_ADDRESS
# TRANSACTION_ID = Meta.TRANSACTION_ID
# BLOCK_HASH = Meta.BLOCK_HASH

# web3 provider (Binance Smart Chain)
web3 = Web3(Web3.HTTPProvider(RPC_URL_HTTP))
web3.middleware_onion.inject(geth_poa_middleware, layer=0)  # middleware for PoA-based TestNet connection.


def _select_data_format(obj, data_format='hexbytes'):
    if data_format in ['hex', 'hexbytes']:
        return obj

    elif data_format in ['str', 'string']:
        if isinstance(obj, dict):
            return convert_dict_json_serializable(obj)
        elif isinstance(obj, list):
            return convert_list_json_serializable(obj)


def _dict_without_keys(dictionary, keys):
    return {key: dictionary[key] for key in dictionary if key not in keys}


def _convert_data_json_serializable(data):  # recursive

    if data is None:
        return None
    elif isinstance(data, HexBytes):
        return data.hex()
    elif isinstance(data, list):
        return [_convert_data_json_serializable(ele) for ele in data]
    elif isinstance(data, dict) or isinstance(data, AttributeDict):
        data = dict(data)
        for key, val in data.items():
            data[key] = _convert_data_json_serializable(val)
        return data
    else:
        return data


def convert_dict_json_serializable(dictionary):
    for key, val in dictionary.items():
        dictionary[key] = _convert_data_json_serializable(val)
    return dictionary


def convert_list_json_serializable(list_obj):
    for index, value in enumerate(list_obj):
        list_obj[index] = _convert_data_json_serializable(value)
    return list_obj


def pretty_print_dict(obj):
    """
    특정 딕셔너리 내의 모든 HexBytes/Bytes 데이터를 recursive하게 string으로 변환
    """
    if type(obj) not in [dict, AttributeDict]:
        raise Exception

    dictionary = dict(obj)
    serializable = convert_dict_json_serializable(dictionary)

    pretty_json = json.dumps(serializable, indent=4)
    print(pretty_json)


def get_latest_block_number():
    return web3.eth.get_block_number()


def get_block_header(block_identifier, data_format='hexbytes'):
    block = dict(web3.eth.get_block(block_identifier))
    block_header = _dict_without_keys(block, ['transactions'])

    return _select_data_format(block_header, data_format)


def get_transactions_from_block(block_identifier, data_format='hexbytes'):
    block = dict(web3.eth.get_block(block_identifier))
    transactions = block['transactions']

    return _select_data_format(transactions, data_format)


def get_block(block_identifier, data_format='hexbytes'):  # block header + transactions
    block = dict(web3.eth.get_block(block_identifier))

    return _select_data_format(block, data_format)


def get_transaction(trx_hash, data_format='hexbytes'):
    transaction = dict(web3.eth.get_transaction(trx_hash))

    return _select_data_format(transaction, data_format)


def get_transaction_receipt(trx_hash, data_format='hexbytes'):
    receipt = dict(web3.eth.get_transaction_receipt(trx_hash))

    return _select_data_format(receipt, data_format)

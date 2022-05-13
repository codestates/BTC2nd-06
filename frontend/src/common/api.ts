import { api } from "./interceptor";

export async function createWallet(params: {
  username: string;
  password: string;
}) {
  const { data } = await api.wallet.post("/api/wallet", params);
  if (data.access_token) {
    localStorage.setItem("access_token", JSON.stringify(data.access_token));
    localStorage.setItem("mnemonic_id", JSON.stringify(data.mnemonicId));
    api.deamon.setToken(data.access_token);
    return data;
  }
  throw new Error();
}

export async function setWalletLogin(params: {
  username: string;
  password: string;
}) {
  const { data } = await api.deamon.post("auth/login/", params);
  if (data.access_token) {
    localStorage.setItem("access_token", JSON.stringify(data.access_token));
    api.deamon.setToken(data.access_token);
    const res = await getMasterWalletInfo();
    localStorage.setItem("mnemonic_id", JSON.stringify(res.data.mnemonic_id));
    return true;
  }
  return false;
}

export async function getMasterWalletInfo() {
  return await api.deamon.get("wallet/master/");
}

export async function getSlaveWalletInfo({ address }: { address: string }) {
  return await api.deamon.get("wallet/derived/", { address });
}

export async function getBalance({ address }: { address: string }) {
  const mid = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  return await api.wallet.get("/api/wallet/address/balance", {
    mnemonicId: mid,
    address,
  });
}

export async function sendCoin({
  fromAddress,
  toAddress,
  amount,
  gas,
  gasPrice,
}: any) {
  const mid = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  return await api.wallet.post("/api/transaction", {
    mnemonicId: mid,
    fromAddr: fromAddress,
    toAddr: toAddress,
    valueBNB: Number(amount),
    gasPrice: Number(gasPrice),
    gas: gas,
  });
}
export async function sendToken({
  fromAddress,
  toAddress,
  amount,
  gas,
  gasPrice,
}: any) {
  const mid = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  return await api.wallet.post("/contract/transfer", {
    mnemonicId: mid,
    fromAddr: fromAddress,
    toAddr: toAddress,
    value: Number(amount),
    gasPrice: Number(gasPrice),
    gas: gas,
  });
}

export async function getTTSBalance({ address }: { address: string }) {
  const mid = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  console.log("!!!", {
    mnemonicId: mid,
    address,
  });
  return await api.wallet.post("/api/contract/balanceOf", {
    mnemonicId: mid,
    tokenAccount: address,
  });
}

export async function getGas({
  toAddr,
  fromAddr,
  valueBNB,
}: {
  toAddr: string;
  fromAddr: string;
  valueBNB: number;
}) {
  const mid = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  return await api.wallet.get("/api/transaction/gas", {
    mnemonicId: mid,
    toAddr,
    fromAddr,
    valueBNB,
  });
}
export async function getGasPrice() {
  const mid = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  return await api.wallet.get("/api/transaction/gasprice", {
    mnemonicId: mid,
  });
}

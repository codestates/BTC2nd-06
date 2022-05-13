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

export async function getGasInfo() {
  return await api.wallet.get("/api/transaction/gas", {
    mnemonicId: "5d0566e0-d204-11ec-97d6-516958c55216",
    fromAddr: "0xBf6Cf485E146796c73064690882d4d238e20A969",
    toAddr: "0x6A840381c14495201Dc0587a6e6584EfdAAB3D90",
    valueBNB: 0.1,
  });
}

export async function sendTransaction() {
  return await api.wallet.post("/api/transaction", {
    mnemonicId: "5d0566e0-d204-11ec-97d6-516958c55216",
    fromAddr: "0x37328309dc63ECD53FfF78BDD868E89051D174f4",
    toAddr: "0x6A840381c14495201Dc0587a6e6584EfdAAB3D90",
    valueBNB: 0,
    gasPrice: "10000000000",
    gas: 21000,
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

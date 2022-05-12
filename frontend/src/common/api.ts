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

export async function getSlaveWalletInfo({
  addresse: target,
}: {
  addresse: string;
}) {
  return await api.deamon.get("wallet/derived/", { target });
}

export async function getBalance({ address }: { address: string }) {
  const m_id = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  const params = {
    address: address,
    mnemonicId: m_id,
  };
  console.log("@@@", params);
  return await api.wallet.get("/wallet/address/balance", params);
}

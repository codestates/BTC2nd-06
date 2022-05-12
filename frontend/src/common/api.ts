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
    return true;
  }
  return false;
}

export async function setWalletLogin(params: {
  username: string;
  password: string;
}) {
  const { data } = await api.deamon.post("auth/login/", params);
  if (data.access_token) {
    localStorage.setItem("access_token", JSON.stringify(data.access_token));
    localStorage.setItem("mnemonic_id", JSON.stringify(data.mnemonicId));
    api.deamon.setToken(data.access_token);
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

export async function getBalance(params: {
  address: string;
  mnemonicId: string;
}) {
  return await api.wallet.get("/wallet/address/balance", params);
}

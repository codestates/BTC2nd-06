import { api } from "./interceptor";

export async function createWallet(params: {
  username: string;
  password: string;
}) {
  const { data } = await api.wallet.post("/api/wallet", params);
  if (data!.access_token) {
    localStorage.setItem("access_token", JSON.stringify(data.access_token));
    api.deamon.setToken(data.access_token);
    return true;
  }
  return false;
}

export async function getMasterWalletInfo() {
  return await api.deamon.get("api/wallet/addresses");
}

export async function getSlaveWalletInfo({
  addresse: target,
}: {
  addresse: string;
}) {
  return await api.deamon.get("wallet/derived", { target });
}

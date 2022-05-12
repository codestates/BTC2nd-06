import { api } from "./interceptor";

export async function createWallet(params: {
  username: string;
  password: string;
}) {
  const { data } = await api.wallet.post("/api/wallet", params);
  console.log("@@@@@@@@", data);
  if (data.access_token) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", data.access_tokens);
    localStorage.setItem("access_token", JSON.stringify(data.access_token));
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

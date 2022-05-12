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

export async function getBalance() {
  // const m_id = localStorage.getItem("mnemonic_id")!.replace(/\"/gi, "");
  return await api.wallet.get("/wallet/address/balance", {
    mnemonicId: '5d0566e0-d204-11ec-97d6-516958c55216"',
    address: "0x6A840381c14495201Dc0587a6e6584EfdAAB3D90",
  });
}

export async function getGasInfo() {
  const params = {
    mnemonicId: "5d0566e0-d204-11ec-97d6-516958c55216",
    fromAddr: "0x6A840381c14495201Dc0587a6e6584EfdAAB3D90",
    toAddr: "0x6A840381c14495201Dc0587a6e6584EfdAAB3D90",
    valueBNB: "00000000000001",
  };
  return await api.wallet.get("/api/transaction/gas", params);
}

import { api } from "./interceptor";

export async function loginWallet() {
  const params = {
    username: "your-username",
    password: "qwer1234!",
    mnemonic_seed:
      "lake clump grant bag crime caution quit industry borrow uniform slush giant",
    address_list: [
      "0x8353F6d00089F911Ed83Ab7979FcB944c539D289",
      "0x757E1EE4F2CF0403eaf0DDc01FfC6EA1A5Cb7219",
      "0x4BEd2ec4777D32Bd669C4C1A88eFAC97a68c0b14",
      "0x31DFD7BAd9a3354dA85D4cE2EDccc70FA7602fAc",
      "0x4D8d9f4A6721471201B251d8DF3316a707b7f5a7",
      "0xA45ceE3620BeB5cefeb6FC49B32F3A1fCe409e7F",
      "0x211bB1Cf41d184ba39fD68724d3d6c7327D50827",
      "0x9f8Ff9ebbb2C1d39498C1Aec04845e3EA9b81041",
      "0x2998C66868FFE584A9AD0BB9Cab95fe71EC3c6Ef",
      "0xB97b8A96B53B5Bfc8Bf88728D1D51325b85d0899",
    ],
  };
  return api.deamon.post("wallet/", params);
}

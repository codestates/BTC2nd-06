import axios from "axios";

const BASE_URL = {
  NODEJS: `http://${window.location.host.split(":")[0]}:2000`,
  DJANGO: "http://ec2-15-164-229-111.ap-northeast-2.compute.amazonaws.com",
} as const;

class Service {
  instance: any; // axios instance;
  constructor(base_url: string) {
    this.init(base_url);
  }

  init(base_url: string) {
    this.instance = axios.create({
      baseURL: base_url,
      timeout: 120 * 1000,
    });
  }

  setToken(token: string) {
    this.instance.defaults.headers.common = {
      Authorization: `bearer ${token}`,
    };
  }

  get(resource: string, params = {}) {
    return this.instance.get(`${resource}`, { params }).catch((error: any) => {
      throw new Error(`service ${resource} ${error}`);
    });
  }

  post(resource: string, params = {}) {
    return this.instance.post(`${resource}`, params).catch((error: any) => {
      throw new Error(`service ${resource} ${error}`);
    });
  }
}

const api = {
  wallet: new Service(BASE_URL.NODEJS),
  deamon: new Service(BASE_URL.DJANGO),
};

export { api };

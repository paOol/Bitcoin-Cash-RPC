let axios = require("axios");

class BitcoinCashRPC {
  constructor(host, username, password, port, timeout) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.port = port;
    this.timeout = timeout;

    //this.instance = axios.create({})
  }

  async buildBody(method, params) {
    var time = Date.now();

    let body = {
      jsonrpc: "1.0",
      id: time,
      method: method
    };

    if (params) {
      body["params"] = params;
    }

    return JSON.stringify(body);
  }

  async performMethod(method, params) {
    let body = await this.buildBody(method, params);
    console.log(body);
    //"Content-Length": body.length
    let req = {
      method: "POST",
      url: `http://${this.host}:${this.port}/`,
      auth: { username: `${this.username}`, password: `${this.password}` },
      headers: {
        "Content-Type": "text/plain"
      },
      timeout: `${this.timeout}`,
      data: `${body}`
    };

    return req;
  }

  async getInfo() {
    let req = await this.performMethod("getinfo");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getInfo", err);
      });
  }
  async getWalletInfo() {
    let req = await this.performMethod("getwalletinfo");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getWalletInfo", err);
      });
  }
  async getUnconfirmedBalance() {
    let req = await this.performMethod("getunconfirmedbalance");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getUnconfirmedBalance", err);
      });
  }

  async getNewAddress(params) {
    let req = await this.performMethod("getnewaddress", params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getNewAddress", err);
      });
  }
}

module.exports = BitcoinCashRPC;
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

  async buildBody(method, ...params) {
    var time = Date.now();

    let body = {
      jsonrpc: "1.0",
      id: time,
      method: method
    };

    if (params.length) {
      body.params = params;
    }

    return JSON.stringify(body);
  }

  async performMethod(method, ...params) {
    if (params.length) {
      var body = await this.buildBody(method.toLowerCase(), ...params);
    } else {
      var body = await this.buildBody(method.toLowerCase());
    }

    console.log("method body", body);
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
    let req = await this.performMethod("getInfo");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getInfo", err.response.data);
      });
  }

  async getWalletInfo() {
    let req = await this.performMethod("getWalletInfo");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getWalletInfo", err.response.data);
      });
  }

  async getUnconfirmedBalance() {
    let req = await this.performMethod("getUnconfirmedBalance");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getUnconfirmedBalance", err.response.data);
      });
  }

  async getBalance() {
    let req = await this.performMethod("getBalance");

    return axios(req)
      .then(response => {
        console.log(response.data);
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getBalance", err.response.data);
      });
  }

  async getNewAddress(...params) {
    let req = await this.performMethod("getNewAddress", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getNewAddress", err.response.data);
      });
  }
  async setTxFee(...params) {
    let req = await this.performMethod("setTxFee", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in setTxFee", err.response.data);
      });
  }
  async validateAddress(...params) {
    if (!this.isValidAddress(...params)) {
      console.log("failed valid check");
      return "invalid address given";
    }

    let req = await this.performMethod("validateAddress", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in validateAddress", err.response.data);
      });
  }
  async sendToAddress(...params) {
    // address - string
    // amount - numeric
    // comment - string (optional)

    if (!this.isValidAddress(...params)) {
      console.log("failed valid check");
      return "invalid address given";
    }

    let req = await this.performMethod("sendToAddress", ...params);
    console.log(req);

    return axios(req)
      .then(response => {
        console.log("in axios", response.data.result);
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in sendToAddress", err);
        return err.message;
      });
  }

  isValidAddress(x) {
    let test = "[13][a-km-zA-HJ-NP-Z0-9]{26,33}";
    let testRegEx = new RegExp(test, "i");
    return testRegEx.test(x);
  }
}

module.exports = BitcoinCashRPC;

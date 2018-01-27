let translate = require("npm-address-translator");
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

  /**
   * @param  {String} Method  name of the method being called
   * @param  {Array}  params  various number of arguments based on method
   * @return {String} body    the plaintext body to POST
   */
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

  /**
   * @param  {String} Method  name of the method
   * @param  {...[type]} params   varies based on the method
   * @return {String} Header  plaintext request object to POST to the node
   */
  async performMethod(method, ...params) {
    if (params.length) {
      var body = await this.buildBody(method.toLowerCase(), ...params);
    } else {
      var body = await this.buildBody(method.toLowerCase());
    }
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
  /**
   * @return estimated transaction fee with parameter for number of blocks
   */
  async estimateSmartFee(...params) {
    let req = await this.performMethod("estimateSmartFee", ...params);
    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in estimateSmartFee", err.response.data);
      });
  }
  /**
   * @return {Object} array of all transactions incoming/outgoing
   */
  async listTransactions() {
    let req = await this.performMethod("listTransactions");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getInfo", err.response.data);
      });
  }
  /**
   * @return {Object} array   version, walletversion, balance, block height, difficulty, tx fee
   */
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
  /**
   * @return {string} height   latest confirmed block number
   */
  async getBlockCount() {
    let req = await this.performMethod("getBlockCount");

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getBlockCount", err.response.data);
      });
  }

  /**
   * @return {Object} array   wallet version, balance, unconfirmed balance, txcount, and what the tx fee was set at
   */
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

  /**
   * @return {String} balance   In satoshis
   */
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

  /**
   * @return {String} balance  in satoshis
   */
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

  /**
 * @param  {Number}  blocknumber  block number you want the hash of
 * @return {String}  blockhash
 */
  async getBlockHash(...params) {
    let req = await this.performMethod("getBlockHash", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getBlockHash", err.response.data);
      });
  }

  /**
 * @param  {String}  account  name of account for new address
 * @return {String}  address
 */
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
  /**
   * @param {String} transaction id
   * @return {String} transaction details
   */
  async getTransaction(...params) {
    let req = await this.performMethod("getTransaction", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getTransaction", err.response.data);
      });
  }
  /**
   * @param {String}  account name of the account
   * @return {String} balance  in satoshis
   */
  async getBalance(...params) {
    let req = await this.performMethod("getBalance", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getBalance", err.response.data);
      });
  }

  /**
   * @param {Number} TxFee transaction fee
   * @return {Boolean} whether it was successful
   */
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

  /**
   * @param  {String} Address   bitcoin address to be checked
   * @return {Boolean}          whether address is valid
   */
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

  /**
   * @param  {String} Address   bitcoin address to send to
   * @param {Number} Amount     number of bitcoin to send
   * @return {String} Tx        returns the transaction ID
   */
  async sendToAddress(...params) {
// temporary solution
//     if (!this.isValidAddress(...params)) {
//       console.log("failed valid check");
//       return "invalid address given";
//     }

    let req = await this.performMethod("sendToAddress", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in sendToAddress", err);
        return err.message;
      });
  }

  /**
   * @param  {String} account   bitcoind account to send from
   * @param  {String} address   bitcoin address to send to
   * @param {Number} Amount     number of bitcoin to send
   * @return {String} Tx        returns the transaction ID
   */
  async sendFrom(...params) {
    if (!this.isValidAddress(...params)) {
      console.log("failed valid check");
      return "invalid address given";
    }

    let req = await this.performMethod("sendFrom", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in sendFrom", err);
        return err.message;
      });
  }

  /**
   * @param  {String} accountName name of account you want the address for
   * @return {String} address       returns the address
   */
  async getAccountAddress(...params) {
    let req = await this.performMethod("getAccountAddress", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getAccountAddress", err);
        return err.message;
      });
  }
  /**
   * @param  {String} blockhash
   * @return {obj} data       returns the block info
   */
  async getBlock(...params) {
    if (!this.isValidAddress(...params)) {
      console.log("failed valid check");
      return "invalid address given";
    }

    let req = await this.performMethod("getBlock", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getBlock", err);
        return err.message;
      });
  }

  /**
   * @param  {String} transaction_id
   * @param {Number} vout     use 1
   * @return {obj} data       returns the tx info
   */
  async getTxOut(...params) {
    if (!this.isValidAddress(...params)) {
      console.log("failed valid check");
      return "invalid address given";
    }

    let req = await this.performMethod("getTxOut", ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        console.log("failed in getTxOut", err);
        return err.message;
      });
  }

  isValidAddress(...x) {
    let test = "[13CH][a-km-zA-HJ-NP-Z0-9]{30,33}";
    let testRegEx = new RegExp(test, "i");
    return testRegEx.test(x);
  }

  translateAddress(address) {
    let test = "[13CH][a-km-zA-HJ-NP-Z0-9]{30,33}";
    let testRegEx = new RegExp(test, "i");
    if (testRegEx.test(address)) {
      let translated = translate.translateAddress(address);
      if (translated.origCoin == "BTC") {
        return translated.origAddress;
      } else {
        return translated.resultAddress;
      }
    }
  }
}

module.exports = BitcoinCashRPC;

let axios = require('axios');

class BitcoinCashRPC {
  constructor(
    host,
    username,
    password,
    port,
    timeout = 3000,
    debugging = true
  ) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.port = port;
    this.timeout = timeout;

    this.debugging = debugging;
  }

  /**
   * @param {String} Method  name of the method being called
   * @param {Array}  params  various number of arguments based on method
   * @return {String} body    the plaintext body to POST
   */
  async buildBody(method, ...params) {
    var time = Date.now();

    let body = {
      jsonrpc: '1.0',
      id: time,
      method: method
    };

    if (params.length) {
      body.params = params;
    }

    return JSON.stringify(body);
  }

  /**
   * @param {String} Method  name of the method
   * @param {...[type]} params   varies based on the method
   * @return {String} Header  plaintext request object to POST to the node
   */
  async performMethod(method, ...params) {
    if (params.length) {
      var body = await this.buildBody(method.toLowerCase(), ...params);
    } else {
      var body = await this.buildBody(method.toLowerCase());
    }
    let req = {
      method: 'POST',
      url: `http://${this.host}:${this.port}/`,
      auth: { username: `${this.username}`, password: `${this.password}` },
      headers: {
        'Content-Type': 'text/plain'
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
    let req = await this.performMethod('estimateSmartFee', ...params);
    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in estimateSmartFee');
        }
      });
  }

  /**
   * @param {Number} number of blocks needed to begin confirmation
   * @return estimated transaction fee per kilobyte
   */
  async estimateFee(...params) {
    let req = await this.performMethod('estimateFee', ...params);
    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err.response.data);
          throw new Error('failed in estimateFee');
        }
      });
  }

  /**
   * @return {Object} array of all UTXOs incoming/outgoing
   */
  async listTransactions() {
    let req = await this.performMethod('listTransactions');

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in listTransactions');
        }
      });
  }

  /**
   * @param {Number} minconf minimum number of confirmations
   * @param {Number} maxconf max number of confirmations
   * @return {Object} array of all UTXOs
   */
  async listUnspent(...params) {
    let req = await this.performMethod('listUnspent', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in listUnspent');
        }
      });
  }

  /**
   * @return {String} change address with bch prefix
   */
  async getRawChangeAddress() {
    let req = await this.performMethod('getRawChangeAddress');

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getRawChangeAddress');
        }
      });
  }

  /**
   * @param {String} RawTX transaction as a string
   * @return {Object} hex value of transaction and complete: true
   */
  async signRawTransaction(...params) {
    let req = await this.performMethod('signRawTransaction', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in signRawTransaction');
        }
      });
  }

  /**
   * @param {String} Address  bch address
   * @param {String} Signature  signature
   * @param {String} Message  contents of message
   * @return {Boolean} whether it is valid
   */
  async verifyMessage(...params) {
    let req = await this.performMethod('verifyMessage', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in verifyMessage');
        }
      });
  }

  /**
   * @return {Object} array   version, walletversion, balance, block height, difficulty, tx fee
   */
  async getInfo() {
    let req = await this.performMethod('getInfo');

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getInfo');
        }
      });
  }

  /**
   * @return {string} height   latest confirmed block number
   */
  async getBlockCount() {
    let req = await this.performMethod('getBlockCount');

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getBlockCount');
        }
      });
  }

  /**
   * @return {Object} array   wallet version, balance, unconfirmed balance, txcount, and what the tx fee was set at
   */
  async getWalletInfo() {
    let req = await this.performMethod('getWalletInfo');

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getWalletInfo');
        }
      });
  }

  /**
   * @return {String} balance   In satoshis
   */
  async getUnconfirmedBalance() {
    let req = await this.performMethod('getUnconfirmedBalance');

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getUnconfirmedBalance');
        }
      });
  }

  /**
   * @param {Number}  blocknumber  block number you want the hash of
   * @return {String}  blockhash
   */
  async getBlockHash(...params) {
    let req = await this.performMethod('getBlockHash', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getBlockHash');
        }
      });
  }

  /**
   * @param {String}  account  name of account for new address
   * @return {String}  address
   */
  async getNewAddress(...params) {
    let req = await this.performMethod('getNewAddress', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getNewAddress');
        }
      });
  }
  /**
   * @param {String} transaction id
   * @param {Boolean} verbose
   * @return {String} transaction details
   */
  async getRawTransaction(...params) {
    let req = await this.performMethod('getRawTransaction', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getRawTransaction');
        }
      });
  }
  /**
   * @param {String} transaction id
   * @return {String} transaction details
   */
  async getTransaction(...params) {
    let req = await this.performMethod('getTransaction', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getTransaction');
        }
      });
  }
  /**
   * @param {String}  account name of the account
   * @return {String} balance  in satoshis
   */
  async getBalance(...params) {
    let req = await this.performMethod('getBalance', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getBalance');
        }
      });
  }

  /**
   * @param {Number} TxFee transaction fee
   * @return {Boolean} whether it was successful
   */
  async setTxFee(...params) {
    let req = await this.performMethod('setTxFee', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in setTxFee');
        }
      });
  }

  /**
   * @param {String} Address   bitcoin address to be checked
   * @return {Boolean}          whether address is valid
   */
  async validateAddress(...params) {
    if (!this.isValidAddress(...params)) {
      throw new Error('failed valid check');
      return 'invalid address given';
    }

    let req = await this.performMethod('validateAddress', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in validateAddress');
        }
      });
  }

  /**
   * @param {String} Address   bitcoin address to send to
   * @param {Number} Amount     number of bitcoin to send
   * @return {String} Tx        returns the transaction ID
   */
  async sendToAddress(...params) {
    // if (!this.isValidAddress(...params)) {
    //   throw new Error('failed valid check');
    //   return 'invalid address given';
    // }

    let req = await this.performMethod('sendToAddress', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in sendToAddress');
        }
      });
  }

  /**
   * @param {String} account   bitcoind account to send from
   * @param {String} address   bitcoin address to send to
   * @param {Number} Amount     number of bitcoin to send
   * @return {String} Tx        returns the transaction ID
   */
  async sendFrom(...params) {
    // if (!this.isValidAddress(params[1])) {
    //   throw new Error('failed valid check');
    //   return 'invalid address given';
    // }

    let req = await this.performMethod('sendFrom', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in sendFrom');
        }
      });
  }

  /**
   * @param {String} accountName name of account you want the address for
   * @return {String} address       returns the address
   */
  async getAccountAddress(...params) {
    let req = await this.performMethod('getAccountAddress', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getAccountAddress');
        }
      });
  }
  /**
   * @param {String} blockhash
   * @return {obj} data       returns the block info
   */
  async getBlock(...params) {
    let req = await this.performMethod('getBlock', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getBlock');
        }
      });
  }

  /**
   * @param {String} transaction
   * @return {obj} data     returns the tx info
   */
  async decodeRawTransaction(...params) {
    let req = await this.performMethod('decodeRawTransaction', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in decodeRawTransaction');
        }
      });
  }
  /**
   * @param {String} transaction_id
   * @param {Number} vout     use 1
   * @return {obj} data       returns the tx info
   */
  async getTxOut(...params) {
    let req = await this.performMethod('getTxOut', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getTxOut');
        }
      });
  }
  /**
   * @param {String} array of txids
   * @param {String} blockhash  looks for txid in block w/ this hash
   * @return {obj} data       returns hex encoded data for proof
   */
  async getTxoutProof(...params) {
    let req = await this.performMethod('getTxoutProof', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getTxoutProof');
        }
      });
  }
  /**
   * @param {Boolean} verbose
   * @return {Object} array   txid
   */
  async getRawMempool(...params) {
    let req = await this.performMethod('getRawMempool', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in getRawMempool');
        }
      });
  }
  /**
   * @param {String} hexstring
   * @return {String} transaction ID
   */
  async sendRawTransaction(...params) {
    let req = await this.performMethod('sendRawTransaction', ...params);

    return axios(req)
      .then(response => {
        return response.data.result;
      })
      .catch(err => {
        if (this.debugging) {
          console.log(err);
          throw new Error('failed in sendRawTransaction');
        }
      });
  }

  isValidAddress(...x) {
    const test = '[13CH][a-km-zA-HJ-NP-Z0-9]{30,33}';
    const cashRegEx = /^((?:bitcoincash):)?(?:[023456789acdefghjklmnpqrstuvwxyz]){42}$/gi;
    let testRegEx = new RegExp(test, 'i');

    if (testRegEx.test(x)) {
      return testRegEx.test(x);
    } else {
      return cashRegEx.test(x);
    }
  }
}

module.exports = BitcoinCashRPC;

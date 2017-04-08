const Web3 = require('web3');
const hashLogger = require('@digix/ipfs-pinning-registry/build/contracts/HashLogger.json');
const LightWalletProvider = require('@digix/truffle-lightwallet-provider');
const { DEFAULT_WEB3_HOST } = require('./constants');

const { KEYSTORE, PASSWORD } = process.env;
if (!KEYSTORE || !PASSWORD) { throw new Error('You must export KEYSTORE and PASSWORD (see truffle.js)'); }

function promisfyMethod(fn, key) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn[key](...args, (err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  };
}

class BlockchainApi {
  constructor(opts = {}) {
    this.startingBlock = opts.startingBlock || 0;
    if (!opts.networkId && !opts.contractAddress) {
      throw new Error('Must provide `networkId` or `contractAddress`');
    }
    if (!opts.contractAddress && !(hashLogger.networks && hashLogger.networks[opts.networkId])) {
      throw new Error(`Contract isnt deployed on networkId ${opts.networkId}, please pass contractAddress`);
    }
    const address = opts.contractAddress || hashLogger.networks[opts.networkId].address;
    const provider = new LightWalletProvider({
      keystore: KEYSTORE,
      password: PASSWORD,
      rpcUrl: opts.providerUrl || DEFAULT_WEB3_HOST,
      pollingInterval: 5000,
    });
    const web3 = new Web3(provider);
    web3.eth.getAccounts((err, res) => { web3.eth.defaultAccount = res[0]; });
    this.contract = web3.eth.contract(hashLogger.abi).at(address);
    ['getUser', 'setHash'].forEach((key) => {
      this[key] = {
        call: promisfyMethod(this.contract[key], 'call'),
        sendTransaction: promisfyMethod(this.contract[key], 'sendTransaction'),
      };
    });
  }
  getExistingHashes() {
    return new Promise((resolve) => {
      const fromBlock = this.startingBlock;
      const toBlock = 'latest';
      this.contract.UpdateHash({}, { fromBlock, toBlock }).get((err, res) => {
        const hashesObj = { };
        let latestBlock = 0;
        res.forEach(({ blockNumber, args }) => {
          if (!hashesObj[args._hash] || hashesObj[args._hash].blockNumber < blockNumber) {
            hashesObj[args._hash] = { blockNumber, added: args._added };
            latestBlock = blockNumber;
          }
        });
        const hashes = Object.keys(hashesObj).reduce((a, hash) => {
          return (hashesObj[hash] && hashesObj[hash].added) ? a.concat([hash]) : a;
        }, []);
        resolve({ hashes, latestBlock });
      });
    });
  }
  watchForUpdates(fn, fromBlock) {
    if (!fromBlock) { throw new Error('no fromBlock set'); }
    const toBlock = 'latest';
    this.contract.UpdateHash({}, { fromBlock, toBlock }, (err, { args }) => {
      fn({ hash: args._hash, added: args._added });
    });
  }
}

module.exports = BlockchainApi;

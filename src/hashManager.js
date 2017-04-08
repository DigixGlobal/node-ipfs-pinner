const util = require('ethereumjs-util');
const multihash = require('multi-hash');
const Blockchain = require('./blockchain');
const Ipfs = require('./ipfs');

function decode({ signature, ipfsHash, timestamp }) {
  const { r, s, v } = util.fromRpcSig(util.addHexPrefix(signature));
  const messageHash = util.sha3(`${ipfsHash}${timestamp}`);
  const address = util.addHexPrefix(util.publicToAddress(util.ecrecover(messageHash, v, r, s)).toString('hex'));
  const decodedIpfsHash = util.addHexPrefix(multihash.decode(ipfsHash).toString('hex'));
  return { decodedIpfsHash, address, timestamp, ipfsHash };
}

class HashManager {
  constructor() {
    this.ipfs = new Ipfs();
    this.blockchain = new Blockchain({ networkId: 42 });
    // initial sync
    this.blockchain.getExistingHashes()
    .then(({ hashes, latestBlock }) => {
      this.ipfs.pin(hashes);
      this.inSync = true;
      this.blockchain.watchForUpdates(({ hash, added }) => {
        if (added) {
          this.ipfs.pin(hash);
        } else {
          this.ipfs.unpin(hash);
        }
      }, latestBlock + 1);
    });
  }
  async processMessage(message) {
    const { decodedIpfsHash, ipfsHash, address, timestamp } = decode(message);
    // TODO validate ipfs hash
    // TODO check if already pinned
    // if (timestamp < new Date().getTime() - (60 * 1000)) { throw new Error('Too old'); }
    const isUser = await this.blockchain.getUser.call(address);
    if (!isUser) { throw new Error('User is not registered'); }
    // TODO do the actual pinning
    // return after this is succesful....
    const tx = await this.blockchain.setHash.sendTransaction(decodedIpfsHash, true);
    console.log(`Broadcasting ${ipfsHash} - ${tx}`);
  }

}

module.exports = HashManager;

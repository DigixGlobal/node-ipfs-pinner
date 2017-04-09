const ipfsAPI = require('ipfs-api');
const multihash = require('multi-hash');
const log = require('./log');

class IpfsApi {
  constructor() {
    this.ipfs = ipfsAPI();
  }
  iterate(_items, add) {
    const items = Array.isArray(_items) ? _items : [_items];
    items.forEach((item) => {
      const hash = item.length === 46 ? item : multihash.encode(item);
      log(`[${!add ? 'un' : ''}pinning] ${hash}`);
      this.ipfs.pin[add ? 'add' : 'remove'](hash, (err) => {
        if (err) { return log(`[error ${!add ? 'un' : ''}pinning] ${hash} - ${err}`); }
        return log(`[${!add ? 'un' : ''}pinned] ${hash}`);
      });
    });
  }
  pin(items) {
    this.iterate(items, true);
  }
  unpin(items) {
    this.iterate(items, false);
  }
}

module.exports = IpfsApi;

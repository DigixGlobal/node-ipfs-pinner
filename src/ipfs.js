class IpfsApi {
  pin(item) {
    console.log('adding to pin queue', item)
  }
  unpin(item) {
    console.log('removing from pin queue', item);
  }
}

module.exports = IpfsApi

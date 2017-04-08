# *pin* `pin-ipfs-node`


Accepts requests with `m` and `s` query strings where:

* `i` is ipfs hash
* `t` is timestamp
* `s` is the result of `web3.eth.sign(address, web3.sha3(i + d))`

e.g.

``` bash
signer: 0x1dceed53f5e9cded9ebd39a830b4a76d9cb2cb93 (recovered)
ipfsHash: QmPH4nmLYxgWyq9FqpzvxAEPZ5ZdwGZjmvusLqPDCk7mu1
timestamp: 1491667840619
signature: e3f482531e99d080fd0ba180d524db3117d67ee49f6d07582cc961c4dbe8c99758908bfbde26a719c3e71a88d94ca3a1e770e2b808e570b69674d1aa5a64c71700
url:
http://localhost:3000/?d=1491667840619&i=QmPH4nmLYxgWyq9FqpzvxAEPZ5ZdwGZjmvusLqPDCk7mu1&s=414b6bcd12c0f78a5e183e714ba21d0efbf169f22976204b11faee5492c82821494f1722e1df221e2925d59d1daf88d99f1c2fe5d9437d138663be7c5d5b047901
````

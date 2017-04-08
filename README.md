# IPFS Pinning Service

Accepts requests with query strings:

* `i` is ipfs hash
* `t` is timestamp
* `s` is the result of `web3.eth.sign(address, web3.sha3(i + d))`

The address is used along wit `ipfs-pinning-registry` to determine whether the address is allowed to pin.

## Example Params

``` bash
given the user address address:
0x1dceed53f5e9cded9ebd39a830b4a76d9cb2cb93

i: QmPH4nmLYxgWyq9FqpzvxAEPZ5ZdwGZjmvusLqPDCk7mu1
t: 1491667840619
s: 414b6bcd12c0f78a5e183e714ba21d0efbf169f22976204b11faee5492c82821494f1722e1df221e2925d59d1daf88d99f1c2fe5d9437d138663be7c5d5b047901

which gives pinning request url:
http://localhost:3000/?d=1491667840619&i=QmPH4nmLYxgWyq9FqpzvxAEPZ5ZdwGZjmvusLqPDCk7mu1&s=414b6bcd12c0f78a5e183e714ba21d0efbf169f22976204b11faee5492c82821494f1722e1df221e2925d59d1daf88d99f1c2fe5d9437d138663be7c5d5b047901
````

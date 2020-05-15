## Maker Liquidation Subgraph

Source code for the subgraph at: https://thegraph.com/explorer/subgraph/ajsantander/maker-liquidations-subgraph

Can be used to query information about maker liquidations:

```
query {
  bids(first: 1000, skip: 0, where: {
    ilk: "ETH-A"
    state: DEALT
  }) {
    lot
    origLot
  }
}
```

Alternatively, run `yarn start` to obtain all results with pagination.

### Maker auction (Flipper) contracts
* ETH-A: https://etherscan.io/address/0xd8a04F5412223F513DC55F839574430f5EC15531#code
* BAT-A: https://etherscan.io/address/0xaa745404d55f88c108a28c86abe7b5a1e7817c07#readContract
* USDC-A: https://etherscan.io/address/0xe6ed1d09a19bd335f051d78d5d22df3bff2c28b1#readContract?
* WBTC-A: https://etherscan.io/address/0x3e115d85d4d7253b05fec9c0bb5b08383c2b0603#code
* SAI: https://etherscan.io/address/0x5432b2f3c0dff95aa191c45e5cbd539e2820ae72#readContract

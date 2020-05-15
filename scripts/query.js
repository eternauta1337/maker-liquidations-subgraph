const fetch = require('node-fetch')
const clipboardy = require('clipboardy')

async function main() {
  const query = `
    query {
      bids(first: 1000, where: {
        state: DEALT
      }) {
        lot
        origLot
      }
    }
  `

  const bids = await findAllDealtBids('ETH-A')
  // console.log(JSON.stringify(bids, null, 2))
  console.log(`total bids found: ${bids.length}`)

  let str = ''
  bids.forEach(bid => {
    const ratio = bid.lot / bid.origLot

    str += `\n${ratio}`
  })

  console.log('Copying results to clipboard...')
  clipboardy.writeSync(str)
  console.log('Done.')
}

async function findAllDealtBids(ilk = undefined, accumulatedBids = [], page = 0) {
  const query = `
    query {
      bids(first: 1000, skip: ${1000 * page}, where: {
        ${ilk ? 'ilk: "' + ilk + '"' : ''}
        state: DEALT
      }) {
        lot
        origLot
      }
    }
  `

  const bids = await performQuery(query)
  console.log(`Querying bids (page ${page}): ${bids.length}`)

  const allBids = accumulatedBids.concat(bids)
  if (bids.length == 1000) {
    return findAllDealtBids(ilk, allBids, page + 1)
  } else {
    return accumulatedBids.concat(allBids)
  }
}

async function performQuery(query) {
  const response = await fetch(
    'https://api.thegraph.com/subgraphs/name/ajsantander/maker-liquidations-subgraph',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }
  )

  const results = await response.json()

  return results.data.bids
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

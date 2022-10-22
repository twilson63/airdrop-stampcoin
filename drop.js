const { WarpFactory, LoggerFactory } = require('warp-contracts')
const fs = require('fs')

const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

const VOUCH_DAO = '_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk'
const STAMP_COIN = 'jAE_V6oXkb0dohIOjReMhrTlgLW0X2j3rxIZ5zgbjXw'

const warp = WarpFactory.forMainnet()

async function main() {
  const { vouched } = await warp.contract(VOUCH_DAO).readState()
    .then(({ cachedValue }) => cachedValue.state)
  const addresses = Object.keys(vouched)
  for (var i = 1; i < addresses.length; i++) {
    if (addresses[i] !== 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI') {
      await warp.contract(STAMP_COIN)
        .connect(wallet)
        .setEvaluationOptions({
          internalWrites: true,
          allowUnsafeClient: true,
          allowBigInt: true
        }).writeInteraction({
          function: 'transfer',
          target: addresses[i],
          qty: 15 * 1e12
        })
      console.log(addresses[i])
    }
    await new Promise(r => setTimeout(r, 1000))
  }


}

main()
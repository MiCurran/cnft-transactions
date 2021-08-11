// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export default async function handler(req, res) {
  let txArr = [];
  let lastSoldFor = 0;
  const API = new BlockFrostAPI({
    projectId: 'R4mWbsBtTtXGwzUQf9x6iuq3FE5CK4JD', // see: https://blockfrost.io
  });
    try {
      const asset = await API.assetsTransactions(
        'd5e6bf0500378d4f0da4e8dde6becec7621cd8cbf5cbb9b87013d4cc5370616365427564363132',
      );
      asset.map((x, i) => {
          if (i < 5){
              txArr.push(x.tx_hash)
          }
      })

      lastSoldFor = (await API.txs(`${txArr[0]}`)).output_amount[0].quantity / 1_000_000;
      
      //console.log('asset', asset);
      //console.log('tx_hash', tx_hash);
      //console.log('tx', tx.output_amount[0].quantity / 1_000_000);
      //console.log('last 5 transactions', txArr);
    } catch (err) {
      console.log('error', err);
    }

  res.status(200).json({ lasttxs: txArr, lastSoldFor: lastSoldFor })
}

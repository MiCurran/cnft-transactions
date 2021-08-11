import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import hex from 'string-hex';

export default async function handler(req, res) {
const { policyId, id } = req.query;
console.log(policyId, id);
let lastSoldFor, secondLastSoldFor = 0;
let image = '';
const hexId = hex(id);
  let adaAmounts = [];
  let txArr = [];
  //process.env.BLOCKFROST_PROJECT_ID
  const API = new BlockFrostAPI({
    projectId: process.env.BLOCKFROST_PROJECT_ID, // see: https://blockfrost.io
  });
    try {
      const assetTransactions = await API.assetsTransactions(
        `${policyId}${hexId}`,{order: 'desc'}
      );
      const assetImage = await API.assetsById(`${policyId}${hexId}`);
       image = assetImage.onchain_metadata.image;
        const last = assetTransactions[0].tx_hash;
        const second = assetTransactions[1]?.tx_hash;
        const lastSold = (await API.txs(`${last}`)).output_amount[0].quantity / 1_000_000;
        const secondSold = (await API.txs(`${second}`)).output_amount[0].quantity / 1_000_000;
        lastSoldFor = lastSold;
        secondLastSoldFor = secondSold;
        adaAmounts.push(lastSold, secondSold)

        console.log('last', lastSold)

      assetTransactions.map((x, i) => {
          if (i < 10){
              txArr.push(x.tx_hash)
          }
      })
      
    } catch (err) {
      console.log('error', err);
    } 

    res.status(200).json({ lasttxs: txArr, adaAmounts: adaAmounts, lastSoldFor: lastSoldFor, assetImage: image })
  }

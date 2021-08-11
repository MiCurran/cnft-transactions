import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import hex from 'string-hex';

export default async function handler(req, res) {
const { policyId, id } = req.query;
let image = '';
let altImage = '';
const hexId = hex(id);
  let txArr = [];
  const API = new BlockFrostAPI({
    projectId: process.env.BLOCKFROST_PROJECT_ID, // see: https://blockfrost.io
  });
    try {
      const assetTransactions = await API.assetsTransactions(
        `${policyId}${hexId}`,{order: 'desc'}
      );
      const assetImage = await API.assetsById(`${policyId}${hexId}`);
       image = assetImage.onchain_metadata.image
       if(!image){
        altImage = assetImage.onchain_metadata.asset.ipfs;
       }

      assetTransactions.map((x, i) => {
          if (i < 10){
              txArr.push(x.tx_hash)
          }
      })
      
    } catch (err) {
      console.log('error', err);
    } 

    res.status(200).json({ lasttxs: txArr, assetImage: image, altImage: altImage })
  }

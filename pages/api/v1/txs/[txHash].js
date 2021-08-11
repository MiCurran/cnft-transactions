import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export default async function handler(req, res) {
const { txHash } = req.query;
console.log(txHash);
const API = new BlockFrostAPI({
    projectId: process.env.BLOCKFROST_PROJECT_ID, // see: https://blockfrost.io
  });
const tx = (await API.txs(txHash));

    res.status(200).json({ tx: tx })
  }

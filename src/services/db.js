import pkg from 'pg';
import {config} from '../../config.js';

const { Client } = pkg;
const client = new Client(config.db);

await client.connect();

export async function query(query, params) {
  const res = await client.query(query, params);

  return res.rows;
}

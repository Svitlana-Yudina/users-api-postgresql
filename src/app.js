/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import pkg from 'pg';
import cors from 'cors';

const server = express();
const port = process.env.PORT || 8080;
const { Client } = pkg;
const client = new Client('postgres://qcewziyl:E4tFnzlQHFhd_aLwuFHfWGuH7fXPZGTk@trumpet.db.elephantsql.com/qcewziyl');

await client.connect();

server.use(cors());
server.use(express.static(path.resolve('public')));
server.use(express.json());

server.get('/users', async(req, res) => {
  try {
    const usersToSend = await client.query(`
      SELECT id, name, birth, email
      FROM users
    `);
    const usersLength = usersToSend.rows.length;

    res.setHeader('Content-Length', usersLength);
    res.send(usersToSend.rows);
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

server.listen(port, () => {
  console.log('server start on port', port);
});

/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import pkg from 'pg';
import cors from 'cors';

const server = express();
const port = process.env.PORT || 5000;
const { Client } = pkg;
const client = new Client('postgres://qcewziyl:E4tFnzlQHFhd_aLwuFHfWGuH7fXPZGTk@trumpet.db.elephantsql.com/qcewziyl');

await client.connect();

server.use(cors());
server.use(express.static(path.resolve('public')));
server.use(express.json());

server.get('/users', async(req, res) => {
  try {
    const usersToSend = await client.query(`
    SELECT
      users.username,
      profiles.first_name,
      profiles.last_name,
      users.email,
      users.role,
      profiles.state
    FROM users JOIN profiles
    ON users.profile_id = profiles.id
    `);

    res.send(usersToSend.rows);
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

server.listen(port, () => {
  console.log('server start on port', port);
});

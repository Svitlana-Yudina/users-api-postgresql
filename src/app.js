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
    const { role } = req.query;

    if (role === undefined) {
      const allUsers = await client.query(`
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

      res.send(allUsers.rows);
      return;
    }

    if (role === 'user' || role === 'admin') {
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
        WHERE users.role = $1
      `, [role]);

      res.send(usersToSend.rows);
      return;
    }

    res.statusCode = 422;
    res.send(`The role must be only 'user' or 'admin'. Try another request.`);
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

server.get('/users/:userId', async(req, res) => {
  try {
    const { userId } = req.params;
    const foundedUser = await client.query(`
      SELECT
        users.username,
        profiles.first_name,
        profiles.last_name,
        users.email,
        users.role,
        profiles.state
      FROM users JOIN profiles
      ON users.profile_id = profiles.id
      WHERE users.id = $1
    `, [Number(userId)]);
    
    if (foundedUser.rows.length === 0) {
      res.statusCode = 404;
      res.send('UserId not found');
      return;
    }

    res.send(foundedUser.rows);
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
})

server.listen(port, () => {
  console.log('server start on port', port);
});

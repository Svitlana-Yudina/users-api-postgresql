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
          users.id,
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
          users.id,
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

    if (!Number(userId)) {
      res.statusCode = 422;
      res.send('UserId must be a number bigger than "0"');
      return;
    }

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
});

server.post('/users', async(req, res) => {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      role,
      state,
    } = req.body;

    if (!username
      || !first_name
      || !last_name
      || !email
      || (role !== 'user' && role !== 'admin')
      || (state !== 'male' && state !== 'female')
    ) {
      res.sendStatus(422);

      return;
    }

    const newProfile_id = await client.query(`
      INSERT INTO public.profiles (
      first_name, last_name, state
      ) VALUES ($1, $2, $3)
       returning id`, [first_name, last_name, state]);

    const profile_id = newProfile_id.rows[0].id;

    const newUserId = await client.query(`
      INSERT INTO public.users (
        username, email, role, profile_id
      ) VALUES ($1, $2, $3, $4)
      returning id`, [username, email, role, profile_id]
    );

    if (!Number(newUserId.rows[0].id)) {
      res.sendStatus(422);
      return;
    }

    res.statusCode = 201;
      res.send({
        username,
        first_name,
        last_name,
        email,
        role,
        state
      }
    );
  } catch (err) {
    res.send('Something went wrong:( We will fix this problem soon');
  }
});

server.delete('/users/:userId', async(req, res) => {
  try {
    const { userId } = req.params;

    if (!Number(userId)) {
      res.statusCode = 422;
      res.send('UserId must be a number bigger than "0"');
      return;
    }
    const foundedUser = await client.query(`
      SELECT * FROM users
      WHERE users.id = $1
    `, [Number(userId)]);

    if (foundedUser.rows.length === 0) {
      res.statusCode = 404;
      res.send('UserId not found');
      return;
    }

    const profile_id = foundedUser.rows[0].profile_id;

    await client.query(`
      DELETE FROM users
      WHERE id = $1;
    `, [Number(userId)]);

    await client.query(`
      DELETE FROM profiles
      WHERE id = $1;
    `, [profile_id]);

    res.sendStatus(204);
  } catch (err) {
    res.send(`Something went wrong:( We will fix this problem soon ${err}`);
  }
});


server.listen(port, () => {
  console.log('server start on port', port);
});

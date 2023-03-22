/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import cors from 'cors';
import * as userServices from './services/users.js';

const server = express();
const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.static(path.resolve('public')));
server.use(express.json());

server.get('/users', async(req, res) => {  
  try {
    const { role } = req.query;

    if (role === undefined) {
      const allUsers = await userServices.getAll();
      
      res.send(allUsers);
      return;
    }

    if (role === 'user' || role === 'admin') {
      const usersToSend = await userServices.getByRole(role);
      
      res.send(usersToSend);
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

    const foundedUser = await userServices.getById(userId);
    
    if (!foundedUser) {
      res.statusCode = 404;
      res.send('UserId not found');
      return;
    }

    res.send(foundedUser);
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

    const createdUser = await userServices.createNewUser({
      username,
      first_name,
      last_name,
      email,
      role,
      state,
    });

    res.statusCode = 201;
    res.send(createdUser);
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
    const foundedUser = await userServices.findUserInDB(userId);

    if (!foundedUser) {
      res.statusCode = 404;
      res.send('UserId not found');
      return;
    }

    const profile_id = foundedUser.profile_id;

    await userServices.remove(userId, profile_id);

    res.sendStatus(204);
  } catch (err) {
    res.send(`Something went wrong:( We will fix this problem soon`);
  }
});

server.put('/users/:userId', async(req, res) => {
  try {
    const { userId } = req.params;

    if (!Number(userId)) {
      res.statusCode = 422;
      res.send('UserId must be a number bigger than "0"');
      return;
    }

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

    const foundedUser = await userServices.findUserInDB(userId);

    if (!foundedUser) {
      res.statusCode = 404;
      res.send('UserId not found');
      return;
    }

    const profile_id = foundedUser.profile_id;

    const updatedUser = await userServices.update(
      userId,
      profile_id,
      {
        username,
        first_name,
        last_name,
        email,
        role,
        state,
      });

    res.statusCode = 201;
    res.send(updatedUser);

  } catch (err) {
    res.send(`Something went wrong:( We will fix this problem soon`);
  }
});


server.listen(port, () => {
  console.log('server start on port', port);
});

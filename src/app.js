/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import cors from 'cors';
import * as userServices from './services/users.js';
import * as userControllers from './controllers/users.js';

const server = express();
const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.static(path.resolve('public')));

server.get('/users', async(req, res) => {  
  const { role } = req.query;

  if (role === undefined) {
    await userControllers.getAll(req, res);
    return;
  }

  await userControllers.getByRole(req, res);
});

server.get('/users/:userId', userControllers.getOne);

server.post('/users', express.json(), userControllers.create);

server.delete('/users/:userId', userControllers.remove);

server.put('/users/:userId', express.json(), userControllers.update);


server.listen(port, () => {
  console.log('server start on port', port);
});

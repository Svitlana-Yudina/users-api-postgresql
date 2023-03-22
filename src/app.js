import express from 'express';
import path from 'path';
import cors from 'cors';
import { router as userRouter } from './routes/users.js';

const server = express();
const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.static(path.resolve('public')));
server.use('/users', express.json(), userRouter);

server.listen(port, () => {
  console.log('server start on port', port);
});

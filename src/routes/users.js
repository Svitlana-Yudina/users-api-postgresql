import express from 'express';
import * as userControllers from '../controllers/users.js';

export const router = express.Router();

router.get('/', userControllers.hasRole, userControllers.getByRole);

router.get('/', userControllers.getAll);

router.get('/:userId', userControllers.getOne);

router.post('/', userControllers.create);

router.delete('/:userId', userControllers.remove);

router.put('/:userId', userControllers.update);

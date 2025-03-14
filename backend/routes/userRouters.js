import express from 'express';
import { getAllUsers, createUser, getOneUser, loginUser } from '../controllers/userController.js';

const router = express.Router();


router.get('/users', getAllUsers);

router.get('/users/:user_handle', getOneUser);

router.post('/users', createUser);

router.post('/users/auth/login', loginUser)

export default router;
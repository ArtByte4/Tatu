import express from 'express';
import { getAllUsers, createUser, getOneUser, loginUser, logOutUser } from '../controllers/userController.js';

const router = express.Router();


router.get('/users', getAllUsers);

router.get('/users/:user_handle', getOneUser);

router.post('/users', createUser);

router.post('/users/auth/login', loginUser)

router.post('/users/auth/logout', logOutUser)


export default router;
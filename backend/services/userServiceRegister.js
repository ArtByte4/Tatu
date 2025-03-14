

import bcrypt from 'bcrypt';
import { addUser } from '../models/insertarDatos.js';


const createUser = async (dataUser) => {
    dataUser.password_hash = await bcrypt.hash(dataUser.password_hash, 13);
    return addUser(dataUser)
}


export { createUser };
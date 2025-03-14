

import bcrypt from 'bcrypt';


export const encryptPassword = async (password) => {
    const saltRounds = 13;
    return bcrypt.hash(password, saltRounds);
}


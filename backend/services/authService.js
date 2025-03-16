import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
  const saltRounds = 10; // 13 salt lo ideal
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  console.log(password, hash)
  return bcrypt.compareSync(password, hash);
};

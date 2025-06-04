import bcrypt from "bcrypt";

export const encryptPassword = async (password: string) => {
  const saltRounds = 10; // 13 salt lo ideal
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string) => {
  console.log(password, hash)
  return await bcrypt.compareSync(password, hash);
};

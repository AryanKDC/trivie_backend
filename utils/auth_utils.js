import bcrypt from "bcryptjs";

export const verify = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

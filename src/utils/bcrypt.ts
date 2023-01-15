import bcrypt from "bcrypt";
import config from "../config/config";

export const encryptPassword = (password: string): string => {
  console.log(`password ${password}`);
  console.log(`SaltRounds ${config.SaltRounds}`);

  return bcrypt.hashSync(password, config.SaltRounds!);
};

export const comparePassword = async (
  encryptedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, encryptedPassword);
};

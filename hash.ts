// import * as bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

export async function hashPassword(plainPassword: string) {
  const SALT_ROUNDS = 10;
  const hash: string = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hash;
}

export async function checkPassword(
  plainPassword: string,
  hashedPassword: string
) {
  const isMatched: boolean = await bcrypt.compare(
    plainPassword,
    hashedPassword
  );
  return isMatched;
}

// (async function ():Promise<any>{
// const hash:string = await hashPassword("alvasuen");
// console.log(hash);
// const result:boolean = await checkPassword("alvasuen",hash);
// console.log(result);
// })();
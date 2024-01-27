import * as bcrypt from 'bcryptjs';

export class HashUtil {
    
  static async genSalt(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) reject(err);
        resolve(salt);
      });
    });
  }

  static async hash(salt: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }

  static async compare(password: string, hashed_password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashed_password, function (err, hash) {
       if (err) reject(err);
       resolve(hash);
     });
   });
  }

}
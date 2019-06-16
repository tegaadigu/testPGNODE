require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const first = require('lodash/first');

class Account {
  constructor(db) {
    this._db = db;
  }

  /**
   * @param loginParm
   * @returns {Promise<void>}
   */
  async login(loginParm) {
    const { email } = loginParm;
    const query = {
      text: 'SELECT email, password, firstName, lastName FROM users WHERE email = $1',
      values: [email],
    };

    return new Promise((resolve, reject) => {
      this._db.query(query).then(res => {
        const { firstname, lastname, password } = first(res.rows);
        const passwordIsValid = bcrypt.compareSync(loginParm.password, password);
        if(passwordIsValid) {
          const token = jwt.sign({email, firstname, lastname}, process.env.JWT_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY
          });
          resolve(token)
        }else {
          reject('Error Invalid password');
        }
      }).catch(err => reject(err));
    });
  }
}

module.exports = Account;

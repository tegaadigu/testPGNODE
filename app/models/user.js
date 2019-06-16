require('dotenv').config();
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const first = require('lodash/first');

class User {
  constructor(db) {
    this._db = db;
  }

  /**
   * Example data.
   * {
   * "email": "test@axiomzen.co",
   * "password": "axiomzen",
   * "firstName": "Alex",
   * "lastName": "Zimmerman"
   * }
   * @param {{String name, String email}} userParam
   *
   */
  async createUser(userParam) {
    const { firstName, lastName, email, password } = userParam;
    const hashedPassword = bcrypt.hashSync(password, process.env.SALT_ROUNDS);
    const date = moment().format('YYYY/MM/DD');
    const query = {
      text: 'INSERT INTO users(email, password, firstname, lastname, created, modified ) VALUES($1, $2, $3, $4, $5, $6)',
      values: [email, hashedPassword, firstName, lastName, date, date ],
    };

    return new Promise((resolve, reject) => {
        this._db.query(query).then(() => {
          const token = jwt.sign({email, firstName, lastName}, process.env.JWT_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY
          });
          resolve(token);
        }).catch(e => {
          reject(e.stack);
        })
    })
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async getUsers() {
    const query = {
      text: 'SELECT email, firstname, lastname FROM users'
    };

    return new Promise((resolve, reject) => {
      this._db.query(query).then((res) => {
        resolve(res.rows);
      }).catch(e => {
        reject(e);
      })
    })
  }

  /**
   *
   * @param email
   * @param userParam
   * @returns {Promise<void>}
   */
  async putUser(email, { firstName, lastName }) {
    const query = {
      text: 'SELECT id from users where email = $1',
      values: [email],
    };

    return new Promise((resolve, reject) => {
      this._db.query(query).then((res) => {
        const { id } = first(res.rows);
        const updateQuery = {
          text: 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3',
          values: [firstName, lastName, id],
        };
        this._db.query(updateQuery).then(res => {
          resolve(res);
        }).catch(e => {
          reject(e);
        })
      }).catch(e => {
        reject(e);
      })
    })
  }
}

module.exports = User;
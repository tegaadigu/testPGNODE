const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const pool = require('../../database/config');
const { check, validationResult } = require('express-validator/check');
const { asyncMiddleware } = require('../middlewares');

/**
 * Handle Login
 * Authenticate user based on passed param - validate param first.
 * returns token on successful login.
 */
router.post('/login', [
  check('email').isEmail(),
  check('password').isLength({min: 5})
], asyncMiddleware(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const account = new Account(pool);
  const token = await account.login(req.body);
  res.json({ token });
}));

module.exports = router;
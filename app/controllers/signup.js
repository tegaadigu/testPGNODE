const express = require('express');
const router = express.Router();
const User = require('../models/user');
const pool = require('../../database/config');
const { check, validationResult } = require('express-validator/check');
const { asyncMiddleware } = require('../middlewares');

/**
 * Handle Signup
 * Create user based on passed param - validate param first.
 */
router.post('/signup', [
  check('email').isEmail(),
  check('password').isLength({ min: 5 }),
  check('firstName').isLength({min: 1}),
  check('lastName').isLength({min: 1})
], asyncMiddleware(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const user = new User(pool);
  const token = await user.createUser(req.body)
  res.json({ token });
}));


module.exports = router;

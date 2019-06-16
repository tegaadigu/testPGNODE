const express = require('express');
const jwt = require('jsonwebtoken');

// Routes that require a token to access..
const authRoutes = express.Router();

authRoutes.use((req, res, next) =>{
  // check header for the token
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['access-token'];
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
      if (err) {
        return res.status(422).json({ message: 'Invalid token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(422).json({ message: 'No token provided' });
  }
});

// Simple wrapper for async try catch.
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };


module.exports = {
  authRoutes,
  asyncMiddleware,
};
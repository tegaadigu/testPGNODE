const pool = require('../../database/config');
const User = require('../../app/models/user');
const { asyncMiddleware, authRoutes } = require('../../app/middlewares/');

/**
 * Handle Retrieving user information
 * Authenticate user based on passed param - validate param first.
 * returns array of all users.
 */
const router = authRoutes;
const user = new User(pool);

router.get('/users', asyncMiddleware(async (req, res) => {
  const users = await user.getUsers();
  res.json({ users });
}));

router.put('/users', (req, res) => {
  const { email } = req.decoded;
  user.putUser(email, req.body);
  res.json({ message: 'Successfully updated' });
});

module.exports = router;
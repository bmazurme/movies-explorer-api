const router = require('express').Router();
const {
  validateUserData,
} = require('../utils/validator');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch(
  '/users/me',
  validateUserData,
  updateUser,
);

module.exports = router;

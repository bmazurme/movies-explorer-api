const router = require('express').Router();
const {
  validateLoginData,
  validateRegistrData,
} = require('../utils/validator');
const {
  createUser,
  login,
} = require('../controllers/users');

router.post(
  '/signin',
  validateLoginData,
  login,
);
router.post(
  '/signup',
  validateRegistrData,
  createUser,
);

module.exports = router;

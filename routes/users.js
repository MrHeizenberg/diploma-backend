const router = require('express').Router();
const { getAuthUser, updateUser } = require('../controllers/users');

router.get('/me', getAuthUser);
router.patch('/me', updateUser);

module.exports = router;

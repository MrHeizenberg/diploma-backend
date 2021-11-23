const router = require('express').Router();
const { getAuthUser, updateUser } = require('../controllers/users');
const { validateUpdateUserBody } = require('../middlewares/validations');

router.get('/me', getAuthUser);
router.patch('/me', validateUpdateUserBody, updateUser);

module.exports = router;

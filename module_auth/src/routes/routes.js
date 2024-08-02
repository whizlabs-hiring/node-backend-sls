const express = require('express');
const router = express.Router();
const Controller = require('../controllers/authController');
const auth = require('../../../helpers/auth');

router.post('/register', Controller.register);
router.post('/login', Controller.login);

 module.exports = router;

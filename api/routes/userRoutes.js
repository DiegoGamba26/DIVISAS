const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
router.get('/', controller.list);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify', controller.verify);
router.get('/currency', controller.currency);
router.post('/transaction', controller.transaction);


module.exports = router;
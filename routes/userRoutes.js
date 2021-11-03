const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/').get(userController.getAllUsers);
router.route('/:id', userController.getUser);

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);

module.exports = router;

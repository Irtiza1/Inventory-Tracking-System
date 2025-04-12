const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/AuthMiddleware');

router.post('/', UserController.createUser);
router.get('/',UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.get('/:name', UserController.getUserByUsername);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;

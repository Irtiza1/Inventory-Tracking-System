const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/AuthMiddleware');

router.post('/', authenticate, authorize(['admin']), UserController.createUser);
router.get('/', authenticate, authorize(['admin']), UserController.getAllUsers);
router.get('/:id', authenticate, authorize(['admin', 'store-manager', 'supplier']), UserController.getUserById);
router.put('/:id', authenticate, authorize(['admin', 'store-manager', 'supplier']), UserController.updateUser);
router.delete('/:id', authenticate, authorize(['admin']), UserController.deleteUser);

module.exports = router;

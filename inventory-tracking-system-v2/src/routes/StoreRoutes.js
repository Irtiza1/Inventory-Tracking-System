const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/storeController');

router.post('/', StoreController.createStore);
router.get('/', StoreController.getAllStores);
router.get('/:id', StoreController.getStoreById);
router.put('/:id', StoreController.updateStore);
router.delete('/:id', StoreController.deleteStore);

module.exports = router;

const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');

router.post('/', StoreController.createStore);
router.get('/', StoreController.getAllStores);
router.get('/:idOrName', StoreController.getStoreByIdOrName);
router.put('/:idOrName', StoreController.updateStoreByIdOrName);
router.delete('/:idOrName', StoreController.deleteStoreByIdOrName);

module.exports = router;

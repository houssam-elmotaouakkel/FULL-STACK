const express = require('express');
const router = express.Router();
const resourceControllers = require('../controllers/resourceControllers')
const validateResource = require('../middlewares/validateResource');

router.get('/', resourceControllers.getAll);
router.get('/:id', resourceControllers.getById);
router.post('/', validateResource, resourceControllers.createResource);
router.put('/:id', validateResource, resourceControllers.updateResource);
router.delete('/:id', resourceControllers.deleteResource);

module.exports = router;
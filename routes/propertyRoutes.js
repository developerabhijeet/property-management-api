const express = require('express');
const propertyController = require('../controllers/propertyController');

const router = express.Router();

// Row operations
router.get('/fetch', propertyController.getAllProperties);
router.post('/create', propertyController.addProperty);
router.put('/update/:id', propertyController.updateProperty);
router.delete('/delete/:id', propertyController.deleteProperty);

// Column operations
router.post('/column/add', propertyController.addColumn);
router.put('/column/rename/:column_name', propertyController.renameColumn);
router.delete('/column/delete/:column_name', propertyController.deleteColumn);
router.get('/columns/fetch', propertyController.getColumns);

module.exports = router;

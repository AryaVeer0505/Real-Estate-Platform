const router = require('express').Router();

const addProperty = require('../../controller/Property/addProperty.js');
const fetchProperty = require('../../controller/Property/fetchProperties.js');
const { checkAuth } = require('../../middlewares/checkAuth.js');
const { deleteProperty } = require('../../controller/Property/deleteProperty.js');
const updateProperty = require('../../controller/Property/updateProperty.js');
const getPropertyByIds = require('../../controller/Property/getPropertyById');
router.post('/addProperty', checkAuth, addProperty);
router.get('/allProperties', checkAuth, fetchProperty);
router.delete('/deleteProperty/:id', checkAuth, deleteProperty);
router.put('/updateProperty/:id', checkAuth, updateProperty);
router.get('/:id', getPropertyByIds);

module.exports = router;

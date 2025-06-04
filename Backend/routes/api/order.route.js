const { checkAuth } = require("../../middlewares/checkAuth");

const router = require("express").Router();
const placeOrder=require("../../controller/Order/placeOrder.js")
const myOrders=require("../../controller/Order/myOrders.js")
const {allOrders}=require("../../controller/Order/allOrders.js")
const updateOrders=require("../../controller/Order/updateOrders.js")
const ownerOrders=require("../../controller/Order/ownerOrders.js")
router.post('/stripe',checkAuth,placeOrder)
router.get('/myOrders',checkAuth,myOrders)
router.get('/ownerOrders',checkAuth,ownerOrders)
router.get('/allOrders',checkAuth,allOrders)
router.put('/update/:id',checkAuth,updateOrders)

module.exports = router;
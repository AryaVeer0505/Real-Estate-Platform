const router=require("express").Router();
const authRoutes=require("./auth.route.js")
const contactRoutes=require('./contact.route.js')
const uploadFile=require('./upload.route.js')
const property=require('./property.route.js')
const favorite=require('./favorities.route.js')
const cart=require('./cart.route.js')
router.use("/auth",authRoutes)
router.use("/contact_us",contactRoutes)
router.use("/uploadFile",uploadFile)
router.use("/property",property)
router.use("/favorite",favorite)
router.use("/cart",cart)
module.exports=router
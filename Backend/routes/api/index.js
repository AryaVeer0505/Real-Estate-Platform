const router=require("express").Router();
const authRoutes=require("./auth.route.js")
const contactRoutes=require('./contact.route.js')
router.use("/auth",authRoutes)
router.use("/contact_us",contactRoutes)
module.exports=router
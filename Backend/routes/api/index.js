const router=require("express").Router();
const authRoutes=require("./auth.route.js")
const contactRoutes=require('./contact.route.js')
const uploadFile=require('./upload.route.js')
router.use("/auth",authRoutes)
router.use("/contact_us",contactRoutes)
router.use("/uploadFile",uploadFile)
module.exports=router
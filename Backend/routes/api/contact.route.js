const router=require("express").Router();
const contact=require("../../controller/conatact_us/contact")
router.post("/contact",contact)
module.exports=router
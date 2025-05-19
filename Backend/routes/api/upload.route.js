const router=require('express').Router()
const upload=require('../../controller/UploadFile/upload.js')
const { checkAuth } = require('../../middlewares/checkAuth.js')

router.post("/upload",checkAuth,upload)

module.exports=router
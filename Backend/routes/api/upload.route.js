const router=require('express').Router()
const upload=require('../../controller/UploadFile/upload.js')

router.post("/upload",upload)

module.exports=router
const router=require('express').Router()
const apiRoute=require('./api/index.js')
router.use('/api',apiRoute)
 module.exports=router
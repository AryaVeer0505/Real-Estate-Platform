const router=require('express').Router()
const authRoute=require('./auth.route.js')
const contactRoute=require('./contact.route.js')

router.use('/auth',authRoute)
router.use('/contact_us',contactRoute)

module.exports=router
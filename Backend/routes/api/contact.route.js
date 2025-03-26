const router=require('express').Router()

const contact=require('../../controller/Contact/contact.js')

router.post('/contact',contact)

module.exports=router
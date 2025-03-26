const router=require('express').Router()

const register=require('../../controller/Auth/register.js')
const login=require('../../controller/Auth/login.js')

router.post('/register',register)
router.post('/login',login)

module.exports=router
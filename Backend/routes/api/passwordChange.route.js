const router = require("express").Router();
const changePassword=require("../../controller/Password/changePassword.js")
const {checkAuth} = require('../../middlewares/checkAuth.js');
router.post('/change-password',checkAuth,changePassword)

module.exports = router;
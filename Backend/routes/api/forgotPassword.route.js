const router = require("express").Router();
const forgotPassword=require("../../controller/Password/forgotPassword.js")
router.post('/forgotPassword',forgotPassword)

module.exports = router;
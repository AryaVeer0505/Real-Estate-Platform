// const router=require("express").Router();
// const register=require("../../controller/auth/register.js")
// const login=require("../../controller/auth/login.js")
// const checkAuth=require("../../middlewares/checkAuth.js")
// router.post("/register",register)
// router.post("/login",checkAuth,login)
// module.exports=router

const router = require("express").Router();
const register = require("../../controller/auth/register.js");
const login = require("../../controller/auth/login.js");
const checkAuth = require("../../middlewares/checkAuth.js");

router.post("/register", register); 
router.post("/login", login);       

router.get("/profile", checkAuth, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;

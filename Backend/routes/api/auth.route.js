
const router = require("express").Router();
const register = require("../../controller/Auth/register.js");
const login = require("../../controller/auth/login.js");
const {checkAuth} = require("../../middlewares/checkAuth.js");
const getUsers = require("../../controller/auth/getUsers.js");
const addUser = require("../../controller/auth/addUser.js")
const {deleteUser}=require("../../controller/auth/deleteUser.js")
const updateUser=require("../../controller/auth/updateUser.js")
const google=require("../../controller/auth/google.js")
router.delete("/deleteUser/:id",checkAuth,deleteUser)
router.put("/updateUser/:id",checkAuth,updateUser)
router.post("/register", register);
router.post("/login",login);
router.get("/getUsers",checkAuth, getUsers);
router.post("/addUser",checkAuth, addUser)
router.post("/google", google)

module.exports = router;


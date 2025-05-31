
const router = require("express").Router();
const register = require("../../controller/Auth/register.js");
const login = require("../../controller/Auth/login.js");
const {checkAuth} = require("../../middlewares/checkAuth.js");
const getUsers = require("../../controller/Auth/getUsers.js");
const addUser = require("../../controller/Auth/addUser.js")
const {deleteUser}=require("../../controller/Auth/deleteUser.js")
const updateUser=require("../../controller/Auth/updateUser.js")
const google=require("../../controller/Auth/google.js")
router.delete("/deleteUser/:id",checkAuth,deleteUser)
router.put("/updateUser/:id",checkAuth,updateUser)
router.post("/register", register);
router.post("/login",login);
router.get("/getUsers",checkAuth, getUsers);
router.post("/addUser",checkAuth, addUser)
router.post("/google", google)

module.exports = router;


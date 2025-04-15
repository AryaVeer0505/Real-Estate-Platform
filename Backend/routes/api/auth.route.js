
const router = require("express").Router();
const register = require("../../controller/auth/register.js");
const login = require("../../controller/auth/login.js");
const checkAuth = require("../../middlewares/checkAuth.js");
const getUsers = require("../../controller/auth/getUsers.js");
const addUser = require("../../controller/auth/addUser.js")
const deleteUser=require("../../controller/auth/deleteUser.js")
const updateUser=require("../../controller/auth/updateUser.js")

router.delete("/deleteUser/:id",deleteUser)
router.put("/updateUser/:id",updateUser)
router.post("/register", register);
router.post("/login",login);
router.get("/getUsers", getUsers);
router.post("/addUser", addUser)

module.exports = router;


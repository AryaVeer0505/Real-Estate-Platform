
const router = require("express").Router();
const register = require("../../controller/auth/register.js");
const login = require("../../controller/auth/login.js");
const checkAuth = require("../../middlewares/checkAuth.js");
const getUsers = require("../../controller/auth/getUsers.js");
const addUser = require("../../controller/auth/addUser.js")

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.post("/addUser", addUser)

module.exports = router;


const User=require("../../models/User.model.js")
const bcrypt=require("bcryptjs")
const createDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ role: "admin" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("aryaveer", 10);
    const newAdmin = new User({
      username: "Aryaveer",
      email: "aryaveerkanwar11458@gmail.com",
      number:"7018800377",
      password: hashedPassword,
      role: "admin",
    });
    await newAdmin.save();
    console.log("Default admin created");
  }
  else{
    console.log("hello")
  }
};
module.exports=createDefaultAdmin

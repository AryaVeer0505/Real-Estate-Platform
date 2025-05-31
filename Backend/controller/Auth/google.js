require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../../utils/googleClient.js");
const GoogleUser = require("../../Models/google.models.js");

const googleRegister = async (req, res) => {
  try {
    const { code, role = "user" } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }

    console.log("Received code:", code);

    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", tokens);

    if (!tokens.access_token) {
      return res.status(400).json({ message: "Failed to obtain access token" });
    }

    oauth2Client.setCredentials({ access_token: tokens.access_token });

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );

    console.log("User info from Google:", userRes.data);

    const { sub: googleId, email, name, picture } = userRes.data;

    if (!email) {
      return res.status(400).json({ message: "Email not found in Google account" });
    }

    let user = await GoogleUser.findOne({ email });

    if (!user) {

      user = await GoogleUser.create({
        name,
        email,
        image: picture,
        googleId,
        role,
      });
      console.log("New user created:", user);
    } else {
      user.googleId = googleId;
      user.image = picture;
      await user.save();
      console.log("Existing user updated:", user);
    }

   const token = jwt.sign(
  {
    _id: user._id,
    email: user.email,
    role: user.role,
    userType: "GoogleUser", 
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "7d" }
);


    res.status(200).json({
      message: "Registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        token,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Google SignUp Error:", err.message);

    if (err.response) {
      console.log("Error response data:", err.response.data);
      console.log("Error response status:", err.response.status);
    }

    res.status(500).json({ 
      message: "Internal Server Error", 
      error: err.message 
    });
  }
};

module.exports = googleRegister;

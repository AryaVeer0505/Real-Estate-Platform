const {google} = require("googleapis")
require('dotenv').config();
const GOOGLE_CLIENT_ID_ = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET_ = process.env.GOOGLE_CLIENT_SECRET
exports.oauth2Client = new google.auth.OAuth2(
   GOOGLE_CLIENT_ID_,
   GOOGLE_CLIENT_SECRET_,
   "postmessage"
) 
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    number: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    role: {
        type: String,
        enum:['user','owner','admin'],
        default : "user"
    }
});

module.exports = model("User", UserSchema, "users");

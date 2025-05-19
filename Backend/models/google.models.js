const {Schema,model}=require("mongoose")

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "owner"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports=model("GoogleUser",usersSchema,"googleuser")
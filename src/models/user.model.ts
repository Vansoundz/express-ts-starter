import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
});

export default model("user", UserSchema);

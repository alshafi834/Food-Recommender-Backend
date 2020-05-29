const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userShcema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, required: true, maxlength: 3 },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  //image: { type: String, required: true },
  //places: { type: String, required: true },
});

userShcema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userShcema);

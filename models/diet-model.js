const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const dietSchema = new Schema({
  created_at: { type: Date },
  dietlist: { type: Array },
  user: { type: String },
  total_cal: { type: Number },
});

dietSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Diet", dietSchema);

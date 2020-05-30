const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const foodsSchema = new Schema({
  Food_Name: { type: String },
  Category: { type: String },
  Quantity: { type: String },
  Calorie: { type: String },
  Protein: { type: String },
  Carbohydrate: { type: String },
  Diabetes_Type1_allowed: { type: String },
  Diabates_Type2_allowed: { type: String },
  Dyslipidemia_HighColestrol_Allowed: { type: String },
  Dyslipidemia_LowColestrol_Allowed: { type: String },
  CKD_Allowed: { type: String },
  //image: { type: String, required: true },
  //places: { type: String, required: true },
});

foodsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Food", foodsSchema);

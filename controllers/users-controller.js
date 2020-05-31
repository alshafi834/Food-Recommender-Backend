const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users-model");
const Food = require("../models/foods-model");

//Get the userlist
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError("Couldnt fetch user, please try again", 500);
    return next(err);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//Sign up functionality
const signUp = async (req, res, next) => {
  console.log("entering here");
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { username, email, password, age, gender, height, weight } = req.body;

  let isUserExist;
  try {
    isUserExist = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Signup failed, please try again", 500);
    return next(err);
  }
  if (isUserExist) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError("Could not create user, please try again!", 500);
    return next(error);
  }
  const createdUser = new User({
    username,
    email,
    password: hashedPassword,
    age,
    gender,
    height,
    weight,
  });

  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError("Signing up failed, please try again", 500);
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_boiler",
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new HttpError("Signing up failed, please try again!", 500);
    return next(err);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//Login functionality
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let isUserExist;
  try {
    isUserExist = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Login failed, please try again", 500);
    return next(err);
  }

  if (!isUserExist) {
    const error = new HttpError("Invalid username or password, try again", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, isUserExist.password);
  } catch (error) {
    const err = new HttpError(
      "Could not log in, pleas check your credentials",
      500
    );
    return next(err);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid username or password, try again", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: isUserExist.id, email: isUserExist.email },
      "supersecret_boiler",
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new HttpError("Login failed, please try again!", 500);
    return next(err);
  }

  res.json({ userId: isUserExist.id, email: isUserExist.email, token: token });
};

const getUserProfile = async (req, res, next) => {
  const { userID } = req.body;
  console.log(userID);
  let userProfileInfo;

  try {
    userProfileInfo = await User.findOne({ _id: userID });
  } catch (error) {
    const err = new HttpError("Could not find the user with this email", 500);
    return next(err);
  }

  console.log(userProfileInfo);
  res.json(userProfileInfo);
};

const findFood = async (req, res, next) => {
  const { disease, userID } = req.body;
  const queryParam = {};
  queryParam[disease] = "yes";

  let userInfo;
  try {
    userInfo = await User.findOne({ _id: userID });
  } catch (error) {
    const err = new HttpError("Could not find the user with this email", 500);
    return next(err);
  }
  let BMR;
  if (userInfo.gender === "male") {
    BMR = 10 * userInfo.weight + 6.25 * userInfo.height - 5 * userInfo.age + 5;
  } else {
    BMR =
      10 * userInfo.weight + 6.25 * userInfo.height - 5 * userInfo.age - 161;
  }

  let suggestedFoods;
  try {
    suggestedFoods = await Food.find(queryParam);
  } catch (error) {
    const err = new HttpError("Could not find the user with this email", 500);
    return next(err);
  }

  console.log(suggestedFoods);
  res.json({ bmr: BMR, suggestedFoods: suggestedFoods });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
exports.getUserProfile = getUserProfile;
exports.findFood = findFood;

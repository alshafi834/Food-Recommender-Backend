const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const userController = require("../controllers/users-controller");
const checkAuth = require("../middleware/check-auth");

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signUp
);

router.post("/login", userController.login);

router.use(checkAuth);

//router.get("/", userController.getUsers);
router.post("/", userController.getUserProfile);

module.exports = router;

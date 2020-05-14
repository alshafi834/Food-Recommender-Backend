const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("get the main route");
  res.json({ message: "It works!" });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const User = require("../models/usersModel");

// requring topic model

router.get("/", (req, res) => {
  res.send("user profile");
});

module.exports = router;

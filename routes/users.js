const express = require("express");
const bcrypt = require("bcrypt")
const { validateUser, UserModel, validateLogin, genToken } = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth");
// const {pick} = require("lodash")
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Users work" })
})

router.get("/myInfo", auth, async (req, res) => {
  try {
    let data = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})
// can change the role of user to admin or user , must be admin in this endpoint
router.patch("/changeRole/:userId/:role", authAdmin, async (req, res) => {
  let userId = req.params.userId;
  let role = req.params.role;
  try {
    if (userId != req.tokenData._id && userId != "62541346d650abed9e34b8bb") {
      let data = await UserModel.updateOne({ _id: userId }, { role: role })
      res.json(data);
    }
    else {
      res.status(401).json({ err: "you cant change your self" });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err)
  }
})
router.post("/", async (req, res) => {
  // check validate req.body
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "*****";
    // allow me to pick the keys of object i want to show to client side
    // let userObj = pick(user,["_id","name","email","address","role"])
    return res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ code: 11000, err: "Email already in system" })
    }
    console.log(err);
    return res.status(500).json(err);
  }
})

// login
router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // check if there user with that email
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ err: "User not found!" });
    }
    let validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) {
      return res.status(401).json({ err: "User or password is wrong" });
    }
    res.json({ token: genToken(user._id, user.role) });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

module.exports = router;
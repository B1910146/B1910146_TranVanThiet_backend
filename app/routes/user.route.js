const express = require("express");
const users = require("../controllers/users.controller");

const router = express.Router();

router.route("/signup")
    .post(users.create)

router.route("/login")
    .post(users.login)

router.route("/check")
    .get(users.login_check)

router.route("/logout")
    .get(users.logout)

// router.route("/findContacts")
//     .post(users.findContacts)

module.exports = router;
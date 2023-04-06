const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'B1910146', 
    cookie: {
        path    : '/',
        httpOnly: false,
        maxAge  : 1735707600
      },})
);

exports.create = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(401, "Username can't be empty."));
    }
    if (!req.body?.password) {
        return next(new ApiError(401, "Password can't be empty."));
    }
    // console.log(req.body);
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while signing up a user.")
        );
    }
};

exports.login = async (req, res) => {
    if (!req.body?.username) {
        return next(new ApiError(401, "Username can't be empty."));
    }
    if (!req.body?.password) {
        return next(new ApiError(401, "Password can't be empty."));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const loggedInUser = await userService.findByUName(req.body.username);
        if (loggedInUser == null) {
            return res.send("Không tìm thấy user!");
        } 
        // console.log(req.body?.password, "a");
        if (loggedInUser.password == req.body?.password) {
            req.session.userID = loggedInUser._id.toString();
            // console.log(loggedInUser._id.toString());
           return res.send("Đăng nhập thành công!");
        }
    } catch (error) {
        new ApiError(500, "An error occured while signing in.")
    }
};

exports.login_check = async (req, res) => {
    // console.log(req.session.userID);
        if(req.session.userID){
        return res.status(200).json({status: 'Đã đăng nhập', session: req.session.userID})
    }
    return res.status(200).json({status: 'Chưa đăng nhập', session: "No Session"})
}

exports.logout = async (req, res) => {
    req.session.destroy(function(err) {
         return res.status(200).json({status: 'Đã đăng nhập.'})
    })
}



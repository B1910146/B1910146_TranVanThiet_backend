const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'B1910146', 
    cookie: { maxAge: 60000 }})
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

exports.login = async (req, res, next) => {
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
        // console.log(loggedInUser, "a");
        if (loggedInUser.password == req.body?.password) {
            req.session.User = { username: req.body.username }
           return res.send("Đăng nhập thành công!");
        }
        // return res.send("Login thanh cong");
    } catch (error) {
        new ApiError(500, "An error occured while signing in.")
    }
};

exports.login_check = async (req, res, next) => {
        if(req.session.User){
        return res.status(200).json({status: 'Đã đăng nhập', session: req.session.User})
    }
    return res.status(200).json({status: 'Chưa đăng nhập', session: 'No session'})
}

exports.logout = async (req, res, next) => {
    req.session.destroy(function(err) {
         return res.status(200).json({status: 'Đã đăng xuất.'})
    })
}

// exports.findContacts = async (req, res, next) => {
//     let documents = [];

//     try {
//         const contactService = new ContactService(MongoDB.client);
//         const { name } = req.query;
//         if (name) {
//             documents = await contactService.findByName(name);
//         } else {
//             documents = await contactService.find({});
//         }
//     } catch (error) {
//         return next(
//             new ApiError(500, "An error occured while creating the contacts.")
//         );
//     }
//     return res.send(documents);
// };

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();
const contactsRouter = require("./app/routes/contact.route");
const usersRouter = require("./app/routes/user.route");

const users = require("./app/controllers/users.controller");

app.use(cors());
app.use(express.json());
const ApiError = require("./app/api-error");

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'Hello!@#$%^', 
    cookie: { maxAge: 60000 }})
);

app.post('/api/users/login', (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(401, "Username can't be empty."));
    }
    if (!req.body?.password) {
        return next(new ApiError(401, "Password can't be empty."));
    }
    const userCheck = users.login;
    // console.log(userCheck);
    if (userCheck) {
        req.session.User = {
            username: req.body.username
        }
        return res.status(200).json({status: `Login Successfully.`});
    } else {
        res.json({message: "Can't find your account."});
    }
});

app.get('/api/users/session_check', (req, res) => {
    if(req.session.User){
        return res.status(200).json({status: 'success', session: req.session.User})
    }
    return res.status(200).json({status: 'error', session: 'No session'})
})

app.get('/api/users/logout', (req, res) => {
    req.session.destroy(function(err) {
        return res.status(200).json({status: 'Logout Successfully.'})
    })
})

app.get("/", (req, res) => {
    res.json({message: "Welcome to contact book application."});
});

app.use("/api/contacts", contactsRouter);

app.use("/api/users", usersRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});






module.exports = app;
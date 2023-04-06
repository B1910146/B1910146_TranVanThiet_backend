const ContactService = require("../services/contact.sevice");
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
    // if (!req.body?.name) {
    //     return next(new ApiError(401, "Name can't be empty."));
    // }
    console.log(req.body);
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body, req.session.userID);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while creating the contact.")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while creating the contacts.")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found."));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can't be empty."));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found."));
        }
        return res.send({message: "Contact was update successfully."});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully."});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Couldn't delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were(was) deleted successfully.`
        });
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while removing all contacts."
            )
        );
    }
};

exports.findAllFavorite = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite contacts."
            )
        );
    }
};
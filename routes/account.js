const account = require("../api/account");
const express = require('express');
const router = express.Router();

module.exports = (router) => {
    router.post("/login", account.login)
}
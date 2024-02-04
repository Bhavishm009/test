const asyncHandler = require("../helpers/catch-async")


const account = {
    login: asyncHandler(async(req, res) => {
        const body = req.body;
        console.log(body);
        return res.json({
            message: "Hello"
        })
    })
}

module.exports = account;
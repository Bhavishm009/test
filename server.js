"use strict";

const config = require("config");
//const baseUrl = config.get("baseUrl");
const port = config.get("port");
const express = require('express');
const appRoutes = require("./routes/index");
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const morgan = require('morgan');




// Enable CORS
app.use(cors({ origin: '*' }));

// Body parser middleware
app.use(express.json());

// Helmet for security headers
app.use(helmet());

// Compression middleware
app.use(compression());

// Disable x-powered-by header
app.disable('x-powered-by');


// Use morgan for request logging
app.use(morgan('combined'));


// Use your routes
app.use("/api/v1", (err, req, res, next) => {
    if (err && err.statusCode === 429) {
        res.status(429).json({ status: 429, message: "You have exceeded your 5 requests per minute limit." });
    }
    process.on("uncaughtException", function (err) {
        return res.status(417).json({ status: 417, message: err.message });
    });
    next();
}, appRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

"use strict";

const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const appRoutes = require("./routes/index");
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

// Load configuration from JSON file
const configPath = './config/default.json';

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const port = config.port;
const httpsPort = 443;  // Default HTTPS port

const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/fullchain.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/privkey.pem', 'utf8');
const cas = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/chain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: cas };

//const server = require("http").createServer(app);
const server = require("https").createServer(credentials, app);
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

// Determine environment (local or online)

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});




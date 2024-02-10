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
const httpsPort = 80;  // Default HTTPS port

console.log('Database Configuration:', config.database);

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
const isLocal = config.environment === 'local';

if (isLocal) {
    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
} else {
    const privateKey = fs.readFileSync('/path/to/private-key.pem', 'utf8');
    const certificate = fs.readFileSync('/path/to/certificate.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(httpsPort, () => {
        console.log(`Server is running at https://api.hdfonline.in`);
    });
}

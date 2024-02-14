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
const rfs = require('rotating-file-stream');
const path = require('path');
const app = express();

// Load configuration from JSON file
const configPath = './config/default.json';

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const port = config.port;
const httpsPort = 3000;  // Default HTTPS port

//For Online Uncomment This For Depolyment

const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/cert.pem', 'utf8');
const cas = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/chain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: cas };
//For Local
//const server = require("http").createServer(app);
//For Online
const server = require("https").createServer(credentials, app);
// landing
app.get("/", (req, res) => {
    res.render("server");
});

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

const pad = (num) => (num > 9 ? '' : '0') + num;
// Create a rotating file stream using the custom token for the filename
const accessLogStream = rfs.createStream((time) => {
  time = new Date()
  const month = time.getFullYear() + '-' + pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  return `${month}-${day}-file.log`;
}, {
  interval: '1d', // rotate daily
  maxFiles: 15,
  maxSize: '25M',
  path: path.join(__dirname, 'log'),
  compress: 'gzip',
});

// Use morgan for request logging
morgan.token('body', req => {
    return JSON.stringify(req.body)
})
morgan.token('time', req => {
    return (new Date(Date.now()))
})
app.use(morgan(':time :method :url :body :req[header] :status :response-time ms :total-time[digits] :user-agent', { stream: accessLogStream }))

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
    // Pass to next layer of middleware
    next();
});


// Use your routes
// app.use("/api/v1", (err, req, res, next) => {
//     if (err && err.statusCode === 429) {
//         res.status(429).json({ status: 429, message: "You have exceeded your 5 requests per minute limit." });
//     }
//     process.on("uncaughtException", function (err) {
//         return res.status(417).json({ status: 417, message: err.message });
//     });
//     next();
// }, appRoutes);

app.use("/api/v1", appRoutes);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Determine environment (local or online)
// const isLocal = config.environment === 'local';

// if (isLocal) {
//     const httpServer = http.createServer(app);

//     httpServer.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//     });

// } else {

//     const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/privkey.pem', 'utf8');
//     const certificate = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/cert.pem', 'utf8');
//     const cas = fs.readFileSync('/etc/letsencrypt/live/api.hdfonline.in/chain.pem', 'utf8');

//     const credentials = { key: privateKey, cert: certificate, ca: cas };

//     const httpsServer = https.createServer(credentials, app);

//     httpsServer.listen(httpsPort, '0.0.0.0', () => {
//         console.log(`Server is running at https://api.hdfonline.in`);
//     });
// }

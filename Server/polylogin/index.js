var express = require('express');

var fs = require('fs');
var https = require('https');
var db = require("./db");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var privateKey  = fs.readFileSync('cert/key2.pem', 'utf8');
var certificate = fs.readFileSync('cert/cert2.pem', 'utf8');
var chain = fs.readFileSync('cert/chain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate, ca: [chain]};

var app = express();
var dropbox = require("./sources/dropbox");
var google = require("./sources/google");
var onedrive = require("./sources/onedrive");

var httpsServer = https.createServer(credentials, app);

var path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log requests to console
app.use(morgan('dev'));

app.use('/', express.static(path.join(__dirname, 'front')));

app.use('/', express.static(path.join(__dirname, 'front')));

require("./routes")(app, db, dropbox, google, onedrive);

db.init(function() {
  httpsServer.listen(443);
  console.log('Node listening on port');
});

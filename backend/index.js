var express = require('express'); // Server Type: Express
var bodyParser = require('body-parser'); // JSON Converter
var cors = require('cors')

var app = express(); // Initialize express
var port = process.env.PORT || 3000; // Execute server on port 3000

// Cast query received (POST-GET...) to JSON object
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

const MySQL = require('./modules/mysql.js') // Gets MySql from modules

app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
});
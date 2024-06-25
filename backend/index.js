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

app.get('/users', async function(req, res) {
    let query = req.query;
    console.log(query)
    // Validate that query parameters are present
    if (!query.username || !query.password) {
        return res.status(400).send({ status: "error", message: "Username and password are required." });
    }

    const loginQuery = `SELECT * FROM Users WHERE username = "${query.username}" AND password = "${query.password}"`;
    const loginSuccessful = await MySQL.makeQuery(loginQuery);

    if (loginSuccessful.length === 1) {
        console.log("Login OK");
        res.send({ status: "ok" });
    } else {
        console.log("Login failed");
        res.status(401).send({ status: "error", message: "Invalid username or password." });
    }
});

app.post('/users', async function(req, res) {
    let body = req.body;

    // Validación de entradas
    if (!body.username || !body.password || body.players_completed === undefined || body.players_failed === undefined || body.perfect_elevens === undefined) {
        return res.status(400).send({ status: "error", message: "All fields are required." });
    }
    
    usernameExists = await MySQL.makeQuery(`SELECT * FROM Users WHERE username = "${body.username}"`);

    if (usernameExists === undefined || usernameExists.length === 0) {
        const insertUser = await MySQL.makeQuery(`INSERT INTO Users (username, password, players_completed, players_failed, perfect_elevens) VALUES ("${body.username}", "${body.password}", "${body.players_completed}", "${body.players_failed}", "${body.perfect_elevens}");`);
        res.send({status: "ok", message: "User registered successfully!"});
        
    } else {
        console.log("Username is already used")
        res.status(401).send({status: "error", message: "Username is already used"});
    }
});
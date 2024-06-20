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
    const response = await MySQL.makeQuery(`SELECT * FROM Users;`)
    res.send(response)
})

app.post('/users', async function(req, res) {
    let body = req.body;
    username = await MySQL.makeQuery(`SELECT * FROM Users WHERE username = "${body.username}"`);
    if (username === undefined || username.length === 0) {
        const respuesta = await MySQL.makeQuery(`INSERT INTO Users (username, password, players_completed, players_failed, perfect_elevens) VALUES ("${body.username}", "${body.password}", "${body.players_completed}", "${body.players_failed}", "${body.perfect_elevens}");`);
        res.send({message: "Register succesfully"});
        
    } else {
        console.log("Username is already used")
        res.send({message: "Username is already used"});
    }
});
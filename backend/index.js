var express = require('express'); // Server Type: Express
var bodyParser = require('body-parser'); // JSON Converter
var cors = require('cors');

var app = express(); // Initialize express
var port = process.env.PORT || 3000; // Execute server on port 3000

// Parse received query (POST-GET...) to JSON object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const MySQL = require('./modules/mysql.js'); // Gets MySql from modules

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Defined routes:');
});

app.get('/users', async function (req, res) {
    try {
        let query = req.query;
        console.log(query);

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
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ status: "error", message: "An error occurred during login." });
    }
});

app.post('/users', async function (req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.username || !body.password || body.players_completed === undefined || body.players_failed === undefined || body.perfect_elevens === undefined) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        let usernameExists = await MySQL.makeQuery(`SELECT * FROM Users WHERE username = "${body.username}"`);

        if (usernameExists === undefined || usernameExists.length === 0) {
            await MySQL.makeQuery(`INSERT INTO Users (username, password, players_completed, players_failed, perfect_elevens) VALUES ("${body.username}", "${body.password}", "${body.players_completed}", "${body.players_failed}", "${body.perfect_elevens}");`);
            res.send({ status: "ok", message: "User registered successfully!" });
        } else {
            console.log("Username is already used");
            res.status(401).send({ status: "error", message: "Username is already used" });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send({ status: "error", message: "An error occurred during registration." });
    }
});

// HEAD: MATCHES
app.get('/matches', async function (req, res) {
    try {
        const response = await MySQL.makeQuery(`SELECT * FROM Matches;`);
        res.send(response);
    } catch (error) {
        console.error('Error retrieving matches:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving matches." });
    }
});

app.post('/matches', async function (req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.id_team || !body.rival_team || !body.result || !body.date || !body.id_stadium || !body.id_league) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        // Check if the match already exists
        let matchExists = await MySQL.makeQuery(`SELECT * FROM Matches WHERE id_team = "${body.id_team}" AND rival_team = "${body.rival_team}" AND date = "${body.date}"`);

        if (matchExists === undefined || matchExists.length === 0) {
            // Insert new match
            await MySQL.makeQuery(`INSERT INTO Matches (id_team, rival_team, result, date, id_stadium, id_league) VALUES ("${body.id_team}", "${body.rival_team}", "${body.result}", "${body.date}", "${body.id_stadium}", "${body.id_league}")`);
            res.send({ status: "ok", message: "Match added successfully!" });
        } else {
            console.log("Match already exists");
            res.status(401).send({ status: "error", message: "Match already exists" });
        }
    } catch (error) {
        console.error('Error adding match:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the match." });
    }
});

app.put('/matches', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let response = null;
        let setClause = keys.slice(1).map((key, index) => `${key} = '${values[index + 1]}'`).join(', ');

        response = await MySQL.makeQuery(`
        UPDATE Matches
        SET ${setClause}
        WHERE ${keys[0]} = '${values[0]}';`);

        res.send(response);
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).send({ status: "error", message: "An error occurred while updating the match." });
    }
});

app.delete('/matches', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let response = null;
        const ids = [];

        // Loop to find ids that match one or more criteria
        for (let i = 0; i < keys.length; i++) {
            response = await MySQL.makeQuery(`
            SELECT id_match FROM Matches
            WHERE ${keys[i]} = "${values[i]}";`);

            console.log("response: ", response);
            if (response.length !== 0 && response !== undefined) {
                ids.push(response[0].id_match);
            }
        }

        if (ids.length === 0 || ids === undefined) {
            return res.send("No matches with that characteristic");
        }

        // Delete id by id
        for (let i = 0; i < ids.length; i++) {
            response = await MySQL.makeQuery(`
            DELETE FROM Elevens
            WHERE id_match = "${ids[i]}";`);

            response = await MySQL.makeQuery(`
            DELETE FROM Matches
            WHERE id_match = "${ids[i]}";`);
        }

        res.send(response);
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).send({ status: "error", message: "An error occurred while deleting the match." });
    }
});

// HEAD: PLAYERS
app.get('/players', async function (req, res) {
    try {
        const response = await MySQL.makeQuery(`SELECT * FROM Players;`);
        res.send(response);
    } catch (error) {
        console.error('Error retrieving players:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving players." });
    }
});

app.post('/players', async function (req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.surname || !body.nationality || body.surname_letters === undefined) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        // Check if the player already exists
        let playerExists = await MySQL.makeQuery(`SELECT * FROM Players WHERE surname = "${body.surname}" AND nationality = "${body.nationality}"`);

        if (playerExists === undefined || playerExists.length === 0) {
            // Insert new player
            await MySQL.makeQuery(`INSERT INTO Players (surname, nationality, surname_letters) VALUES ("${body.surname}", "${body.nationality}", "${body.surname_letters}")`);
            res.send({ status: "ok", message: "Player added successfully!" });
        } else {
            console.log("Player already exists");
            res.status(401).send({ status: "error", message: "Player already exists" });
        }
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the player." });
    }
});

app.put('/players', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let response = null;
        let setClause = keys.slice(1).map((key, index) => `${key} = '${values[index + 1]}'`).join(', ');

        response = await MySQL.makeQuery(`
        UPDATE Players
        SET ${setClause}
        WHERE ${keys[0]} = '${values[0]}';`);

        res.send(response);
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).send({ status: "error", message: "An error occurred while updating the player." });
    }
});

app.delete('/players', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let response = null;
        const ids = [];

        // Loop to find ids that match one or more criteria
        for (let i = 0; i < keys.length; i++) {
            response = await MySQL.makeQuery(`
            SELECT id_player FROM Players
            WHERE ${keys[i]} = "${values[i]}";`);

            console.log("response: ", response);
            if (response.length !== 0 && response !== undefined) {
                ids.push(response[0].id_player);
            }
        }

        if (ids.length === 0 || ids === undefined) {
            return res.send("No players with that characteristic");
        }

        // Delete id by id
        for (let i = 0; i < ids.length; i++) {
            response = await MySQL.makeQuery(`
            DELETE FROM Elevens
            WHERE id_player = "${ids[i]}";`);

            response = await MySQL.makeQuery(`
            DELETE FROM Players
            WHERE id_player = "${ids[i]}";`);
        }

        res.send(response);
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).send({ status: "error", message: "An error occurred while deleting the player." });
    }
});

// HEAD: TEAMS
app.get('/teams', async function(req, res) {
    try {
        const response = await MySQL.makeQuery("SELECT * FROM Teams;");
        res.send(response);
    } catch (error) {
        console.error('Error retrieving teams:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving teams." });
    }
});

app.post('/teams', async function(req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.name || !body.country) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        // Insert new team
        await MySQL.makeQuery(`INSERT INTO Teams (name, country) VALUES ("${body.name}", "${body.country}")`);
        res.send({ status: "ok", message: "Team added successfully!" });
    } catch (error) {
        console.error('Error adding team:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the team." });
    }
});

app.put('/teams', async function(req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let response = null;
        let setClause = keys.slice(1).map((key, index) => `${key} = '${values[index + 1]}'`).join(', ');

        response = await MySQL.makeQuery(`
        UPDATE Teams
        SET ${setClause}
        WHERE ${keys[0]} = '${values[0]}';`);

        res.send(response);
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).send({ status: "error", message: "An error occurred while updating the team." });
    }
});

app.delete('/teams', async function(req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let response = null;
        const ids = [];

        // Find ids that match one or more criteria
        for (let i = 0; i < keys.length; i++) {
            response = await MySQL.makeQuery(`
            SELECT id_team FROM Teams
            WHERE ${keys[i]} = "${values[i]}";`);

            console.log("response: ", response);
            if (response.length !== 0 && response !== undefined) {
                ids.push(response[0].id_team);
            }
        }

        if (ids.length === 0 || ids === undefined) {
            return res.send("No teams with that characteristic");
        }

        // First delete from Elevens table
        for (let i = 0; i < ids.length; i++) {
            response = await MySQL.makeQuery(`
            DELETE FROM Elevens
            WHERE id_team = "${ids[i]}";`);
        
        // Then delete from TeamsByLeagues
            response = await MySQL.makeQuery(`
            DELETE FROM TeamsByLeagues
            WHERE id_team = "${ids[i]}";`);

        // Then delete from Teams table
            response = await MySQL.makeQuery(`
            DELETE FROM Teams
            WHERE id_team = "${ids[i]}";`);}


        res.send(response);
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).send({ status: "error", message: "An error occurred while deleting the team." });
    }
});

// HEAD: LEAGUES
app.get('/leagues', async function(req, res) {
    try {
        const response = await MySQL.makeQuery("SELECT * FROM Leagues;");
        res.send(response);
    } catch (error) {
        console.error('Error retrieving leagues:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving leagues." });
    }
});

app.post('/leagues', async function(req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.name || !body.country) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        // Check if the league already exists
        let leagueExists = await MySQL.makeQuery(`SELECT * FROM Leagues WHERE name = "${body.name}" AND country = "${body.country}";`);

        if (leagueExists === undefined || leagueExists.length === 0) {
            // Insert new league
            await MySQL.makeQuery(`INSERT INTO Leagues (name, country) VALUES ("${body.name}", "${body.country}");`);
            res.send({ status: "ok", message: "League added successfully!" });
        } else {
            console.log("League already exists");
            res.status(401).send({ status: "error", message: "League already exists" });
        }
    } catch (error) {
        console.error('Error adding league:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the league." });
    }
});

app.put('/leagues', async function(req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let setClause = keys.slice(1).map((key, index) => `${key} = '${values[index + 1]}'`).join(', ');

        await MySQL.makeQuery(
            `UPDATE Leagues
            SET ${setClause}
            WHERE ${keys[0]} = '${values[0]}';`
        );

        res.send({ status: "ok", message: "League updated successfully!" });
    } catch (error) {
        console.error('Error updating league:', error);
        res.status(500).send({ status: "error", message: "An error occurred while updating the league." });
    }
});

app.delete('/leagues', async function(req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let ids = [];

        // Loop to find ids that match one or more criteria
        for (let i = 0; i < keys.length; i++) {
            let response = await MySQL.makeQuery(`SELECT id_league FROM Leagues WHERE ${keys[i]} = "${values[i]}";`);

            console.log("response: ", response);
            if (response.length !== 0 && response !== undefined) {
                ids.push(response[0].id_league);
            }
        }

        if (ids.length === 0 || ids === undefined) {
            return res.send("No leagues with that characteristic");
        }

        // Delete associated records from dependent tables
        for (let i = 0; i < ids.length; i++) {
            await MySQL.makeQuery(`DELETE FROM TeamsByLeagues WHERE id_league = "${ids[i]}";`);
            await MySQL.makeQuery(`DELETE FROM Matches WHERE id_league = "${ids[i]}";`);
            await MySQL.makeQuery(`DELETE FROM Leagues WHERE id_league = "${ids[i]}";`);
        }

        res.send({ status: "ok", message: "Leagues deleted successfully!" });
    } catch (error) {
        console.error('Error deleting league:', error);
        res.status(500).send({ status: "error", message: "An error occurred while deleting the league." });
    }
});



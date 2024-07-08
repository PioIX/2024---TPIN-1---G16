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

// HEAD: STADIUMS
app.get('/stadiums', async function (req, res) {
    try {
        const response = await MySQL.makeQuery("SELECT * FROM Stadiums;");
        res.send(response);
    } catch (error) {
        console.error('Error retrieving stadiums:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving stadiums." });
    }
});

app.post('/stadiums', async function (req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.name || !body.city) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        // Check if the stadium already exists
        let stadiumExists = await MySQL.makeQuery(`SELECT * FROM Stadiums WHERE name = "${body.name}" AND city = "${body.city}";`);

        if (stadiumExists === undefined || stadiumExists.length === 0) {
            // Insert new stadium
            await MySQL.makeQuery(`INSERT INTO Stadiums (name, city) VALUES ("${body.name}", "${body.city}");`);
            res.send({ status: "ok", message: "Stadium added successfully!" });
        } else {
            console.log("Stadium already exists");
            res.status(401).send({ status: "error", message: "Stadium already exists" });
        }
    } catch (error) {
        console.error('Error adding stadium:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the stadium." });
    }
});

app.put('/stadiums', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let setClause = keys.slice(1).map((key, index) => `${key} = '${values[index + 1]}'`).join(', ');

        await MySQL.makeQuery(`
            UPDATE Stadiums
            SET ${setClause}
            WHERE ${keys[0]} = '${values[0]}';`
        );

        res.send({ status: "ok", message: "Stadium updated successfully!" });
    } catch (error) {
        console.error('Error updating stadium:', error);
        res.status(500).send({ status: "error", message: "An error occurred while updating the stadium." });
    }
});

app.delete('/stadiums', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let ids = [];

        // Loop to find ids that match one or more criteria
        for (let i = 0; i < keys.length; i++) {
            let response = await MySQL.makeQuery(`SELECT id_stadium FROM Stadiums WHERE ${keys[i]} = "${values[i]}";`);

            console.log("response: ", response);
            if (response.length !== 0 && response !== undefined) {
                ids.push(response[0].id_stadium);
            }
        }

        if (ids.length === 0 || ids === undefined) {
            return res.send("No stadiums with that characteristic");
        }

        // Delete associated records from Matches table first
        for (let i = 0; i < ids.length; i++) {
            await MySQL.makeQuery(`DELETE FROM Matches WHERE id_stadium = "${ids[i]}";`);
        }

        // Then delete from Stadiums table
        for (let i = 0; i < ids.length; i++) {
            await MySQL.makeQuery(`DELETE FROM Stadiums WHERE id_stadium = "${ids[i]}";`);
        }

        res.send({ status: "ok", message: "Stadiums deleted successfully!" });
    } catch (error) {
        console.error('Error deleting stadium:', error);
        res.status(500).send({ status: "error", message: "An error occurred while deleting the stadium." });
    }
});

function getElevenLineUp(positions){
    let lineup = ""

    let goalkeepers = 0
    let defenders = 0
    let defensiveMidfielders = 0
    let midfielders = 0
    let attackingMidfielders = 0
    let forwards = 0

    for (let i = 0; i < positions.length; i++){
        let position = positions[i].position
        console.log(position)
        if(position[0] == "G"){
            goalkeepers++
        }
        else if(position[1] == "B"){
            defenders++
        }
        else if(position[1] == "D"){
            defensiveMidfielders++
        }
        else if(position[1] == "M"){
            midfielders++
        }
        else if(position[1] == "A"){
            attackingMidfielders++
        }
        else if(position[1] == "F"){
            forwards++
        }
    }
    
    positionsArray = [goalkeepers, defenders, defensiveMidfielders, midfielders, attackingMidfielders, forwards]

    for (let i = 0; i < positionsArray.length; i++){
        if (positionsArray[i] != 0){
            lineup += positionsArray[i]
        }
    }
    
    return lineup
}

// HEAD: ELEVENS
app.get('/elevens', async function (req, res) {
    if (req.query.id_player != undefined){
        try {
            const response = await MySQL.makeQuery(`SELECT Elevens.id_player, surname, surname_letters, position FROM Elevens INNER JOIN Players ON Elevens.id_player = Players.id_player WHERE Elevens.id_player = ${req.query.id_player}`)
            console.log(response)
            res.send(response)
            return;
        }
        catch(error){
            console.error('Error retrieving elevens:', error);
            res.status(500).send({ status: "error", message: "An error occurred while retrieving elevens." });
        }
    }
    
    if (req.query.id_match != undefined){
        try {
            let query = await MySQL.makeQuery(`SELECT position FROM Elevens WHERE id_match = "${req.query.id_match}"`)
            const response = getElevenLineUp(query);
            console.log(response)
            res.send(response)
            return;
        }
        catch(error){
            console.error('Error retrieving elevens:', error);
            res.status(500).send({ status: "error", message: "An error occurred while retrieving elevens." });
        }
    }
    
    try {
        const response = await MySQL.makeQuery("SELECT * FROM Elevens;");
        res.send(response);
    } catch (error) {
        console.error('Error retrieving elevens:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving elevens." });
    }
});

app.post('/elevens', async function (req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.id_player || !body.id_team || !body.shirt_number || !body.position || !body.id_match) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        // Insert new eleven
        await MySQL.makeQuery(`INSERT INTO Elevens (id_player, id_team, shirt_number, position, id_match) VALUES (${body.id_player}, ${body.id_team}, ${body.shirt_number}, "${body.position}", ${body.id_match});`);
        res.send({ status: "ok", message: "Eleven added successfully!" });
    } catch (error) {
        console.error('Error adding eleven:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the eleven." });
    }
});

app.put('/elevens', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        let setClause = `shirt_number = ${body.shirt_number}, position = "${body.position}", id_match = ${body.id_match}`;

        await MySQL.makeQuery(`
            UPDATE Elevens
            SET ${setClause}
            WHERE id_player = ${body.id_player} AND id_team = ${body.id_team};`
        );

        res.send({ status: "ok", message: "Eleven updated successfully!" });
    } catch (error) {
        console.error('Error updating eleven:', error);
        res.status(500).send({ status: "error", message: "An error occurred while updating the eleven." });
    }
});

app.delete('/elevens', async function (req, res) {
    try {
        let body = req.body;
        console.log(body);

        await MySQL.makeQuery(`DELETE FROM Elevens WHERE id_player = ${body.id_player} AND id_team = ${body.id_team};`);

        res.send({ status: "ok", message: "Eleven deleted successfully!" });
    } catch (error) {
        console.error('Error deleting eleven:', error);
        res.status(500).send({ status: "error", message: "An error occurred while deleting the eleven." });
    }
});


// HEAD: TEAMS BY LEAGUES
app.get('/teams-by-leagues', async function(req, res) {
    try {
        const response = await MySQL.makeQuery("SELECT * FROM TeamsByLeagues;");
        res.send(response);
    } catch (error) {
        console.error('Error retrieving teams by leagues:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retrieving teams by leagues." });
    }
});

app.post('/teams-by-leagues', async function(req, res) {
    try {
        let body = req.body;

        // Input validation
        if (!body.id_league || !body.id_team || body.team_number === undefined) {
            return res.status(400).send({ status: "error", message: "All fields are required." });
        }

        // Check if the team by league already exists
        let teamByLeagueExists = await MySQL.makeQuery(`SELECT * FROM TeamsByLeagues WHERE id_league = "${body.id_league}" AND id_team = "${body.id_team}";`);

        if (teamByLeagueExists === undefined || teamByLeagueExists.length === 0) {
            // Insert new team by league
            await MySQL.makeQuery(`INSERT INTO TeamsByLeagues (id_league, id_team, team_number) VALUES ("${body.id_league}", "${body.id_team}", "${body.team_number}");`);
            res.send({ status: "ok", message: "Team by league added successfully!" });
        } else {
            console.log("Team by league already exists");
            res.status(401).send({ status: "error", message: "Team by league already exists" });
        }
    } catch (error) {
        console.error('Error adding team by league:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the team by league." });
    }
});

app.put('/teams-by-leagues', async function(req, res) {
    try {
        let body = req.body;
        console.log(body);

        let keys = Object.keys(body);
        let values = Object.values(body);

        let setClause = keys.slice(2).map((key, index) => `${key} = '${values[index + 2]}'`).join(', ');

        await MySQL.makeQuery(`
            UPDATE TeamsByLeagues
            SET ${setClause}
            WHERE ${keys[0]} = '${values[0]}' AND ${keys[1]} = '${values[1]}';`
        );

        res.send({ status: "ok", message: "Team by league updated successfully!" });
    } catch (error) {
        console.error('Error updating team by league:', error);
        res.status(500).send({ status: "error", message: "An error occurred while updating the team by league." });
    }
});

app.delete('/teams-by-leagues', async function(req, res) {
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
                SELECT id_league, id_team FROM TeamsByLeagues
                WHERE ${keys[i]} = "${values[i]}";`);

            console.log("response: ", response);
            if (response.length !== 0 && response !== undefined) {
                ids.push({ id_league: response[0].id_league, id_team: response[0].id_team });
            }
        }

        if (ids.length === 0 || ids === undefined) {
            return res.send("No teams by leagues with that characteristic");
        }

        // Delete team by league by id_league and id_team
        for (let i = 0; i < ids.length; i++) {
            await MySQL.makeQuery(`
                DELETE FROM TeamsByLeagues
                WHERE id_league = "${ids[i].id_league}" AND id_team = "${ids[i].id_team}";`);
        }

        res.send({ status: "ok", message: "Teams by leagues deleted successfully!" });
    } catch (error) {
        console.error('Error deleting team by league:', error);
        res.status(500).send({ status: "error", message: "An error occurred while deleting the team by league." });
    }
});


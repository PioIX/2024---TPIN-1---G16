let activeUserId = localStorage.getItem("activeUserId")

if(activeUserId != 1){
    let hostpath = window.location.pathname
    hostpath = hostpath.substring(0, hostpath.lastIndexOf('/'));
    window.location.href = `${hostpath}/chooseteam.html`
}

async function getAllFromMatches() {
    const response = await fetch("http://localhost:3000/matches", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    console.log(result);

    function drawTable(x) {
        const match = result[x];
        document.getElementById("table-matches").innerHTML += `
        <table id="table-match-${match.id_match}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>Id Match:</td>
                <td>${match.id_match}</td>
                <td></td>
            </tr>
            <tr>
                <td>Id Team:</td>
                <td>${match.id_team}</td>
                <td><input type="number" id="id_team-${match.id_match}" value="${match.id_team}"></td>
            </tr>
            <tr>
                <td>Rival Team:</td>
                <td>${match.rival_team}</td>
                <td><input type="text" id="rival_team-${match.id_match}" value="${match.rival_team}"></td>
            </tr>
            <tr>
                <td>Result:</td>
                <td>${match.result}</td>
                <td><input type="text" id="result-${match.id_match}" value="${match.result}"></td>
            </tr>
            <tr>
                <td>Date:</td>
                <td>${match.date.substr(0,10)}</td>
                <td><input type="text" id="date-${match.id_match}" value="${match.date.substr(0,10)}"></td>
            </tr>
            <tr>
                <td>Stadium:</td>
                <td>${match.id_stadium}</td>
                <td><input type="number" id="stadium-${match.id_match}" value="${match.id_stadium}"></td>
            </tr>
            <tr>
                <td>League:</td>
                <td>${match.id_league}</td>
                <td><input type="number" id="league-${match.id_match}" value="${match.id_league}"></td>
            </tr>
        </table>
        <button onclick="deleteMatch(${match.id_match})">Eliminar Partido</button>
        <button onclick="updateMatch(${match.id_match})">Actualizar Partido</button>
        <br>`;
    }

    for (let i = 0; i < result.length; i++) {
        drawTable(i);
    }
}

async function addNewMatch() {
    const match = {
        id_team: document.getElementById("team").value,
        rival_team: document.getElementById("rivalTeam").value,
        result: document.getElementById("result").value,
        date: document.getElementById("date").value,
        id_stadium: document.getElementById("stadium").value,
        id_league: document.getElementById("league").value
    };

    console.log(match);

    try {
        const response = await fetch("http://localhost:3000/matches", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(match)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let res = await response.json();
        console.log(res);
        location.reload();
        document.getElementById("formMatch").reset();  // Limpia el formulario
    } catch (error) {
        console.error('Error adding new match:', error);
    }
}

async function deleteMatch(id) {
    const response = await fetch("http://localhost:3000/matches", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_match: id })
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function updateMatch(id) {
    const data = {
        id_match: id,
        id_team: document.getElementById("id_team-" + id).value,
        rival_team: document.getElementById("rival_team-" + id).value,
        result: document.getElementById("result-" + id).value,
        date: document.getElementById("date-" + id).value,
        id_stadium: document.getElementById("stadium-" + id).value,
        id_league: document.getElementById("league-" + id).value
    };

    console.log(JSON.stringify(data));

    const response = await fetch("http://localhost:3000/matches", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function getAllFromPlayers() {
    const response = await fetch("http://localhost:3000/players", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    console.log(result);

    function drawTable(x) {
        const player = result[x];
        document.getElementById("table-players").innerHTML += `
        <table id="player-table-${player.id_player}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>Player ID:</td>
                <td>${player.id_player}</td>
                <td></td>
            </tr>
            <tr>
                <td>Surname:</td>
                <td>${player.surname}</td>
                <td><input type="text" id="surname-${player.id_player}" value="${player.surname}"></td>
            </tr>
            <tr>
                <td>Nationality:</td>
                <td>${player.nationality}</td>
                <td><input type="text" id="nationality-${player.id_player}" value="${player.nationality}"></td>
            </tr>
            <tr>
                <td>Surname Letters:</td>
                <td>${player.surname_letters}</td>
                <td><input type="number" id="surname_letters-${player.id_player}" value="${player.surname_letters}"></td>
            </tr>
        </table>
        <button onclick="deletePlayer(${player.id_player})">Eliminar Jugador</button>
        <button onclick="updatePlayer(${player.id_player})">Actualizar Jugador</button>
        <br>`;
    }

    for (let i = 0; i < result.length; i++) {
        drawTable(i);
    }
}

async function addNewPlayer() {
    const player = {
        surname: document.getElementById("surname").value,
        nationality: document.getElementById("nationality").value,
        surname_letters: document.getElementById("surname_letters").value
    };

    console.log(player);

    try {
        const response = await fetch("http://localhost:3000/players", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(player)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let res = await response.json();
        console.log(res);
        location.reload();
        document.getElementById("formPlayer").reset();  // Limpia el formulario
    } catch (error) {
        console.error('Error adding new player:', error);
    }
}

async function deletePlayer(id) {
    const response = await fetch("http://localhost:3000/players", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_player: id })
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function updatePlayer(id) {
    const data = {
        id_player: id,
        surname: document.getElementById("surname-" + id).value,
        nationality: document.getElementById("nationality-" + id).value,
        surname_letters: document.getElementById("surname_letters-" + id).value
    };

    console.log(JSON.stringify(data));

    const response = await fetch("http://localhost:3000/players", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function getAllFromTeams() {
    const response = await fetch("http://localhost:3000/teams", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    console.log(result);

    function drawTable(x) {
        const team = result[x];
        document.getElementById("table-teams").innerHTML += `
        <table id="team-table-${team.id_team}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>Team ID:</td>
                <td>${team.id_team}</td>
                <td></td>
            </tr>
            <tr>
                <td>Name:</td>
                <td>${team.name}</td>
                <td><input type="text" id="team-name-${team.id_team}" value="${team.name}"></td>
            </tr>
            <tr>
                <td>Country:</td>
                <td>${team.country}</td>
                <td><input type="text" id="team-country-${team.id_team}" value="${team.country}"></td>
            </tr>
        </table>
        <button onclick="deleteTeam(${team.id_team})">Eliminar Equipo</button>
        <button onclick="updateTeam(${team.id_team})">Actualizar Equipo</button>
        <br>`;
    }

    for (let i = 0; i < result.length; i++) {
        drawTable(i);
    }
}

async function addNewTeam() {
    const team = {
        name: document.getElementById("team-name").value,
        country: document.getElementById("team-country").value
    };

    console.log(team);

    try {
        const response = await fetch("http://localhost:3000/teams", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(team)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let res = await response.json();
        console.log(res);
        location.reload();
        document.getElementById("formTeam").reset();  // Limpia el formulario
    } catch (error) {
        console.error('Error adding new team:', error);
    }
}

async function deleteTeam(id) {
    const response = await fetch("http://localhost:3000/teams", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_team: id })
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function updateTeam(id) {
    const data = {
        id_team: id,
        name: document.getElementById("team-name-" + id).value,
        country: document.getElementById("team-country-" + id).value
    };

    console.log(JSON.stringify(data));

    const response = await fetch("http://localhost:3000/teams", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function getAllFromLeagues() {
    const response = await fetch("http://localhost:3000/leagues", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    console.log(result);

    function drawTable(x) {
        const league = result[x];
        document.getElementById("table-leagues").innerHTML += `
        <table id="league-table-${league.id_league}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>League ID:</td>
                <td>${league.id_league}</td>
                <td></td>
            </tr>
            <tr>
                <td>Name:</td>
                <td>${league.name}</td>
                <td><input type="text" id="league-name-${league.id_league}" value="${league.name}"></td>
            </tr>
            <tr>
                <td>Country:</td>
                <td>${league.country}</td>
                <td><input type="text" id="league-country-${league.id_league}" value="${league.country}"></td>
            </tr>
        </table>
        <button onclick="deleteLeague(${league.id_league})">Eliminar Liga</button>
        <button onclick="updateLeague(${league.id_league})">Actualizar Liga</button>
        <br>`;
    }

    for (let i = 0; i < result.length; i++) {
        drawTable(i);
    }
}

async function addNewLeague() {
    const league = {
        name: document.getElementById("league-name").value,
        country: document.getElementById("league-country").value
    };

    console.log(league);

    try {
        const response = await fetch("http://localhost:3000/leagues", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(league)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let res = await response.json();
        console.log(res);
        location.reload();
        document.getElementById("formLeague").reset();  // Limpia el formulario
    } catch (error) {
        console.error('Error adding new league:', error);
    }
}

async function deleteLeague(id) {
    const response = await fetch("http://localhost:3000/leagues", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_league: id })
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function updateLeague(id) {
    const data = {
        id_league: id,
        name: document.getElementById("league-name-" + id).value,
        country: document.getElementById("league-country-" + id).value
    };

    console.log(JSON.stringify(data));

    const response = await fetch("http://localhost:3000/leagues", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function getAllFromStadiums() {
    const response = await fetch("http://localhost:3000/stadiums", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    console.log(result);

    function drawTable(x) {
        const stadium = result[x];
        document.getElementById("table-stadiums").innerHTML += `
        <table id="stadium-table-${stadium.id_stadium}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>Stadium ID:</td>
                <td>${stadium.id_stadium}</td>
                <td></td>
            </tr>
            <tr>
                <td>Name:</td>
                <td>${stadium.name}</td>
                <td><input type="text" id="stadium-name-${stadium.id_stadium}" value="${stadium.name}"></td>
            </tr>
            <tr>
                <td>City:</td>
                <td>${stadium.city}</td>
                <td><input type="text" id="stadium-city-${stadium.id_stadium}" value="${stadium.city}"></td>
            </tr>
        </table>
        <button onclick="deleteStadium(${stadium.id_stadium})">Eliminar Estadio</button>
        <button onclick="updateStadium(${stadium.id_stadium})">Actualizar Estadio</button>
        <br>`;
    }

    for (let i = 0; i < result.length; i++) {
        drawTable(i);
    }
}

async function addNewStadium() {
    const stadium = {
        name: document.getElementById("stadium-name").value,
        city: document.getElementById("stadium-city").value
    };

    console.log(stadium);

    try {
        const response = await fetch("http://localhost:3000/stadiums", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(stadium)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let res = await response.json();
        console.log(res);
        location.reload();
        document.getElementById("formStadium").reset();  // Limpia el formulario
    } catch (error) {
        console.error('Error adding new stadium:', error);
    }
}

async function deleteStadium(id) {
    const response = await fetch("http://localhost:3000/stadiums", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_stadium: id })
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function updateStadium(id) {
    const data = {
        id_stadium: id,
        name: document.getElementById("stadium-name-" + id).value,
        city: document.getElementById("stadium-city-" + id).value
    };

    console.log(JSON.stringify(data));

    const response = await fetch("http://localhost:3000/stadiums", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function getAllFromElevens() {
    const response = await fetch("http://localhost:3000/elevens", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    console.log(result);

    function drawTable(x) {
        const eleven = result[x];
        document.getElementById("table-elevens").innerHTML += `
        <table id="eleven-table-${String(eleven.id_player) + String(eleven.id_team)}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>Player ID:</td>
                <td>${eleven.id_player}</td>
                <td></td>
            </tr>
            <tr>
                <td>Team ID:</td>
                <td>${eleven.id_team}</td>
                <td></td>
            </tr>
            <tr>
                <td>Shirt Number:</td>
                <td>${eleven.shirt_number}</td>
                <td><input type="number" id="eleven-shirt_number-${String(eleven.id_player) + String(eleven.id_team)}" value="${eleven.shirt_number}"></td>
            </tr>
            <tr>
                <td>Position:</td>
                <td>${eleven.position}</td>
                <td><input type="text" id="eleven-position-${String(eleven.id_player) + String(eleven.id_team)}" value="${eleven.position}"></td>
            </tr>
            <tr>
                <td>Match:</td>
                <td>${eleven.id_match}</td>
                <td><input type="number" id="eleven-match-${String(eleven.id_player) + String(eleven.id_team)}" value="${eleven.id_match}"></td>
            </tr>
        </table>
        <button onclick="deleteEleven(${String(eleven.id_player)}, ${String(eleven.id_team)})">Eliminar Eleven</button>
        <button onclick="updateEleven(${String(eleven.id_player)}, ${String(eleven.id_team)})">Actualizar Eleven</button>
        <br>`;
    }

    for (let i = 0; i < result.length; i++) {
        drawTable(i);
    }
}

async function addNewEleven() {
    const eleven = {
        id_player: document.getElementById("eleven-player").value,
        id_team: document.getElementById("eleven-team").value,
        shirt_number: document.getElementById("eleven-shirt_number").value,
        position: document.getElementById("eleven-position").value,
        id_match: document.getElementById("eleven-match").value
    };

    console.log(eleven);

    try {
        const response = await fetch("http://localhost:3000/elevens", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eleven)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let res = await response.json();
        console.log(res);
        location.reload();
        document.getElementById("formEleven").reset();  // Limpia el formulario
    } catch (error) {
        console.error('Error adding new stadium:', error);
    }
}

async function deleteEleven(id_player, id_team) {
    const response = await fetch("http://localhost:3000/elevens", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_player: id_player, id_team: id_team })
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function updateEleven(id_player, id_team) {
    console.log(`eleven-position-${id_player}${id_team}`)
    const data = {
        id_player: id_player,
        id_team: id_team,
        position: document.getElementById("eleven-position-" + id_player + id_team).value,
        shirt_number: document.getElementById("eleven-shirt_number-" + id_player + id_team).value,
        id_match: document.getElementById("eleven-match-" + id_player + id_team).value
    };

    console.log(JSON.stringify(data));

    const response = await fetch("http://localhost:3000/elevens", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function getAllFromTeamsByLeagues() {
    const response = await fetch("http://localhost:3000/teams-by-leagues", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    console.log(result);

    function drawTable(x) {
        const teamByLeague = result[x];
        document.getElementById("table-teams-by-leagues").innerHTML += `
        <table id="teams-by-leagues-table-${String(teamByLeague.id_league) + String(teamByLeague.id_team)}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>League ID:</td>
                <td>${teamByLeague.id_league}</td>
                <td></td>
            </tr>
            <tr>
                <td>Team ID:</td>
                <td>${teamByLeague.id_team}</td>
                <td></td>
            </tr>
            <tr>
                <td>Team Number:</td>
                <td>${teamByLeague.team_number}</td>
                <td><input type="number" id="teams-by-leagues-team_number-${String(teamByLeague.id_league) + String(teamByLeague.id_team)}" value="${teamByLeague.team_number}"></td>
            </tr>
        </table>
        <button onclick="deleteTeamByLeague(${String(teamByLeague.id_league)}, ${String(teamByLeague.id_team)})">Eliminar Team By League</button>
        <button onclick="updateTeamByLeague(${String(teamByLeague.id_league)}, ${String(teamByLeague.id_team)})">Actualizar Team By League</button>
        <br>`;
    }

    for (let i = 0; i < result.length; i++) {
        drawTable(i);
    }
}

async function addNewTeamByLeague() {
    const teamByLeague = {
        id_league: document.getElementById("teamsByLeagues-league").value,
        id_team: document.getElementById("teamsByLeagues-team").value,
        team_number: document.getElementById("teamsByLeagues-team_number").value
    };

    console.log(teamByLeague);

    try {
        const response = await fetch("http://localhost:3000/teams-by-leagues", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teamByLeague)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let res = await response.json();
        console.log(res);
        location.reload();
        document.getElementById("formTeamsByLeagues").reset();  // Limpia el formulario
    } catch (error) {
        console.error('Error adding new team by league:', error);
    }
}

async function deleteTeamByLeague(id_league, id_team) {
    const response = await fetch("http://localhost:3000/teams-by-leagues", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_league: id_league, id_team: id_team })
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

async function updateTeamByLeague(id_league, id_team) {
    const data = {
        id_league: id_league,
        id_team: id_team,
        team_number: document.getElementById("teams-by-leagues-team_number-" + id_league + id_team).value
    };

    console.log(JSON.stringify(data));

    const response = await fetch("http://localhost:3000/teams-by-leagues", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    console.log(res);
    location.reload();
}

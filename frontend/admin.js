console.log("hello world!")

async function getAllFromMatches() {
    const response = await fetch("http://localhost:3000/matches", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    const result = await response.json()
    console.log(result)

    function drawTable(x) {
        const match = result[x];
        document.getElementById("table").innerHTML += `
        <table id="table-${match.id_match}">
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

    for(let i = 0; i < result.length; i++){
        drawTable(i)
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


async function deleteMatch(id){
    const response = await fetch("http://localhost:3000/matches", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id_match: id})
    })

    let res = await response.json()
    console.log(res)
    location.reload()
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
        <table id="table-${player.id_player}">
            <tr>
                <th>Category</th>
                <th>Current Value</th>
                <th>New Value</th>
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
        <button onclick="deletePlayer(${player.id_player})">Delete Player</button>
        <button onclick="updatePlayer(${player.id_player})">Update Player</button>
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
        document.getElementById("formPlayer").reset();  // Clear the form
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
        <table id="table-${team.id_team}">
            <tr>
                <th>Categoria</th>
                <th>Valor Actual</th>
                <th>Nuevo Valor</th>
            </tr>
            <tr>
                <td>Id Team:</td>
                <td>${team.id_team}</td>
                <td></td>
            </tr>
            <tr>
                <td>Name:</td>
                <td>${team.name}</td>
                <td><input type="text" id="name-${team.id_team}" value="${team.name}"></td>
            </tr>
            <tr>
                <td>Country:</td>
                <td>${team.country}</td>
                <td><input type="text" id="country-${team.id_team}" value="${team.country}"></td>
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
        name: document.getElementById("name").value,
        country: document.getElementById("country").value
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
        name: document.getElementById("name-" + id).value,
        country: document.getElementById("country-" + id).value
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

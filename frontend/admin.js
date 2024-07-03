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

class Player {
    constructor(id_player, surname, position, surname_letters) {
        this.id_player = id_player;
        this.surname = surname;
        this.position = position;
        this.surname_letters = surname_letters;
    }
}

class Wordle {
    constructor(player, numberOfGuesses = 6) {
        this.player = player;
        this.numberOfGuesses = numberOfGuesses;
        this.guessesRemaining = numberOfGuesses;
        this.currentGuess = [];
        this.nextLetter = 0;
        this.rightGuessString = player.surname.toLowerCase();
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener("keyup", (e) => {
            if (this.guessesRemaining === 0 || document.querySelector(`.game-board[data-player-id="${this.player.id_player}"]`).style.display === "none") {
                return;
            }

            let pressedKey = String(e.key);
            if (pressedKey === "Backspace" && this.nextLetter !== 0) {
                this.deleteLetter();
                return;
            }

            if (pressedKey === "Enter") {
                this.checkGuess();
                return;
            }

            let found = pressedKey.match(/[a-z]/gi);
            if (!found || found.length > 1) {
                return;
            } else {
                this.insertLetter(pressedKey);
            }
        });

        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("keyboard-button") && e.target.closest(`.keyboard-cont[data-player-id="${this.player.id_player}"]`)) {
                let key = e.target.textContent;

                if (key === "Del") {
                    key = "Backspace";
                }

                document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
            }
        });
    }

    initBoard() {
        // Verifica si el board ya existe antes de agregarlo
        if (document.querySelector(`.game-board[data-player-id="${this.player.id_player}"]`)) {
            return;
        }
        
        // Verifica si el keyboard ya existe antes de agregarlo
        if (document.querySelector(`.keyboard-cont[data-player-id="${this.player.id_player}"]`)) {
            return;
        }

        let article = document.querySelector('article');
        article.innerHTML += `
            <div class="game-board" data-player-id="${this.player.id_player}">
            </div>
            <div class="keyboard-cont" data-player-id="${this.player.id_player}">
                <div class="first-row">
                    <button class="keyboard-button">q</button>
                    <button class="keyboard-button">w</button>
                    <button class="keyboard-button">e</button>
                    <button class="keyboard-button">r</button>
                    <button class="keyboard-button">t</button>
                    <button class="keyboard-button">y</button>
                    <button class="keyboard-button">u</button>
                    <button class="keyboard-button">i</button>
                    <button class="keyboard-button">o</button>
                    <button class="keyboard-button">p</button>
                </div>
                <div class="second-row">
                    <button class="keyboard-button">a</button>
                    <button class="keyboard-button">s</button>
                    <button class="keyboard-button">d</button>
                    <button class="keyboard-button">f</button>
                    <button class="keyboard-button">g</button>
                    <button class="keyboard-button">h</button>
                    <button class="keyboard-button">j</button>
                    <button class="keyboard-button">k</button>
                    <button class="keyboard-button">l</button>
                </div>
                <div class="third-row">
                    <button class="keyboard-button">Del</button>
                    <button class="keyboard-button">z</button>
                    <button class="keyboard-button">x</button>
                    <button class="keyboard-button">c</button>
                    <button class="keyboard-button">v</button>
                    <button class="keyboard-button">b</button>
                    <button class="keyboard-button">n</button>
                    <button class="keyboard-button">m</button>
                    <button class="keyboard-button">Enter</button>
                </div>
            </div>
            <button class="closeButton" data-player-id="${this.player.id_player}" onclick="game.toggleWordle(${this.player.id_player})">Cerrar</button>
        `;

        let board = document.querySelector(`.game-board[data-player-id="${this.player.id_player}"]`);

        for (let i = 0; i < this.numberOfGuesses; i++) {
            let row = document.createElement("div");
            row.className = `letter-row letter-row${this.player.id_player}`;

            for (let j = 0; j < this.player.surname_letters; j++) {
                let box = document.createElement("div");
                box.className = `letter-box letter-box${this.player.id_player}`;
                row.appendChild(box);
            }

            board.appendChild(row);
        }
    }

    shadeKeyBoard(letter, color) {
        for (const elem of document.querySelectorAll(`.keyboard-cont[data-player-id="${this.player.id_player}"] .keyboard-button`)) {
            if (elem.textContent === letter) {
                let oldColor = elem.style.backgroundColor;
                if (oldColor === 'green') {
                    return;
                }

                if (oldColor === 'yellow' && color !== 'green') {
                    return;
                }

                elem.style.backgroundColor = color;
                break;
            }
        }
    }

    deleteLetter() {
        let row = document.querySelectorAll(`.letter-row${this.player.id_player}`)[this.numberOfGuesses - this.guessesRemaining];
        let box = row.children[this.nextLetter - 1];
        box.textContent = "";
        box.classList.remove("filled-box");
        this.currentGuess.pop();
        this.nextLetter -= 1;
    }

    checkGuess() {
        let row = document.querySelectorAll(`.letter-row${this.player.id_player}`)[this.numberOfGuesses - this.guessesRemaining];
        let guessString = '';
        let rightGuess = Array.from(this.rightGuessString);

        for (const val of this.currentGuess) {
            guessString += val;
        }

        if (guessString.length !== this.player.surname_letters) {
            toastr.error("Not enough letters!");
            return;
        }

        for (let i = 0; i < this.player.surname_letters; i++) {
            let letterColor = '';
            let box = row.children[i];
            let letter = this.currentGuess[i];

            let letterPosition = rightGuess.indexOf(this.currentGuess[i]);
            if (letterPosition === -1) {
                letterColor = 'grey';
            } else {
                if (this.currentGuess[i] === rightGuess[i]) {
                    letterColor = 'green';
                } else {
                    letterColor = 'yellow';
                }

                rightGuess[letterPosition] = "#";
            }

            let delay = 250 * i;
            setTimeout(() => {
                animateCSS(box, 'flipInX');
                box.style.backgroundColor = letterColor;
                this.shadeKeyBoard(letter, letterColor);
            }, delay);
        }

        if (guessString === this.rightGuessString) {
            toastr.success("You guessed right! Game over!");
            this.guessesRemaining = 0;
            return;
        } else {
            this.guessesRemaining -= 1;
            this.currentGuess = [];
            this.nextLetter = 0;

            if (this.guessesRemaining === 0) {
                toastr.error("You've run out of guesses! Game over!");
                toastr.info(`The right word was: "${this.rightGuessString}"`);
            }
        }
    }

    insertLetter(pressedKey) {
        if (this.nextLetter === this.player.surname_letters) {
            return;
        }
        pressedKey = pressedKey.toLowerCase();

        let row = document.querySelectorAll(`.letter-row${this.player.id_player}`)[this.numberOfGuesses - this.guessesRemaining];
        let box = row.children[this.nextLetter];
        animateCSS(box, "pulse");
        box.textContent = pressedKey;
        box.classList.add("filled-box");
        this.currentGuess.push(pressedKey);
        this.nextLetter += 1;
    }
}

class Game {
    constructor() {
        this.players = [];
    }

    async getPlayerInfo(id_player) {
        try {
            const response = await fetch(`http://localhost:3000/elevens?id_player=${id_player}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Player Info:', result); // Imprime la respuesta para verificar
            return result;
        } catch (error) {
            console.error('Error fetching player info:', error);
            return undefined;
        }
    }

    async getElevenLineUp(id_match) {
        const response = await fetch(`http://localhost:3000/elevens?id_match=${id_match}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        console.log(result)
        return result;
    }

    async updatePlayerStats(id_match) {
        const response = await fetch(`http://localhost:3000/elevens`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        console.log(result)
        return result;
    }

    async startGame(id_match, num) {
        const lineup = String(await this.getElevenLineUp(id_match));
        console.log('Lineup:', lineup); // Imprime la alineación para verificar
    
        const article = document.querySelector("article");
        article.innerHTML = `<div class="players"></div>`;
        const playersContainer = document.querySelector(".players");
    
        for (let i = 0; i < lineup.length; i++) {
            playersContainer.innerHTML += `<div class="players-column"></div>`;
            for (let j = 0; j < lineup[i]; j++) {
                const column = document.querySelectorAll(".players-column")[i];
                let playerInfo = await this.getPlayerInfo(num);
                console.log('Player Info Inside startGame:', playerInfo); // Imprime los datos del jugador para verificar
                if (!playerInfo) {
                    console.error('Player info is undefined');
                    continue; // Salta al siguiente jugador si no se obtiene la información
                }
                playerInfo = playerInfo[0]; // Asegúrate de que el formato de playerInfo es correcto
                let player = new Player(playerInfo.id_player, playerInfo.surname, playerInfo.position, playerInfo.surname_letters);
                this.players.push(player);
                column.innerHTML += `<div id="player${player.id_player}" class="player" onclick="game.initBoard(${player.id_player}), game.toggleWordle(${player.id_player})">${player.position}</div>`;
                num++;
            }
        }
    }
    

    initBoard(id_player) {
        const player = this.players.find(p => p.id_player === id_player);
        if (player) {
            // Verifica si el Wordle ya ha sido creado para este jugador
            if (this[`wordle${id_player}`]) {
                return;
            }
            const wordle = new Wordle(player);
            wordle.initBoard();
            this[`wordle${id_player}`] = wordle;
        }
    }

    toggleWordle(id_player) {
        const playersDiv = document.querySelector(".players");
        const board = document.querySelector(`.game-board[data-player-id="${id_player}"]`);
        const keyboard = document.querySelector(`.keyboard-cont[data-player-id="${id_player}"]`);
        const button = document.querySelector(`.closeButton[data-player-id="${id_player}"]`);

        if (playersDiv.style.display !== "none") {
            playersDiv.style.display = "none";
            board.style.display = "";
            keyboard.style.display = "";
            button.style.display = "";
        } else {
            playersDiv.style.display = "";
            board.style.display = "none";
            keyboard.style.display = "none";
            button.style.display = "none";
        }
    }
}

const game = new Game();

const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty('--animate-duration', '0.3s');
        node.classList.add(`${prefix}animated`, animationName);

        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

async function startGame(id_match, num) {
    await game.startGame(id_match, num); // Inicia el juego con los parámetros deseados
}

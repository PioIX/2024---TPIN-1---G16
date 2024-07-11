<<<<<<< Updated upstream
async function getEleven(){
=======
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
            <button class="closeButton" data-player-id="${this.player.id_player}" onclick="game.toggleWordle(${this.player.id_player})">Close</button>
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

        setTimeout(() => {
            if (guessString === this.rightGuessString) {
                toastr.success("You guessed right!");
                let text = document.getElementById(`player${this.player.id_player}`);
                text.innerHTML = this.rightGuessString.toUpperCase();
                alert("acertaste")
                game.updatePlayerStats("players_completed")
                this.guessesRemaining = 0;
                game.toggleWordle(this.player.id_player); // Llama a toggleWordle cuando se acierta
            } else {
                this.guessesRemaining -= 1;
                this.currentGuess = [];
                this.nextLetter = 0;
>>>>>>> Stashed changes
    
}
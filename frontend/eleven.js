const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = "armani"
let surname_letters = undefined

async function getPlayerInfo(id_player){
    const response = await fetch(`http://localhost:3000/elevens?id_player=${id_player}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    return result
}

async function getElevenLineUp(id_match){
    const response = await fetch(`http://localhost:3000/elevens?id_match=${id_match}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    return result
}

async function startGame(id, num){
    const lineup = String(await getElevenLineUp(id))
    

    const article = document.getElementsByTagName("article")[0]

    article.innerHTML += `<div class="players"> </div>`

    const players = document.getElementsByClassName("players")[0]
    for (let i = 0; i < lineup.length; i++){
        players.innerHTML += `<div class="players-column"></div>`
        for (let j = 0; j < lineup[i]; j++){
            const column = document.getElementsByClassName("players-column")[i]
            let playerInfo = await getPlayerInfo(num)
            playerInfo = playerInfo[0]
            // console.log("info: ", playerInfo)
            column.innerHTML += `<div id="player${playerInfo.id_player}" class="player" onclick="initBoard(${playerInfo.id_player}, ${playerInfo.surname_letters}), screenWordle(${playerInfo.id_player})">${playerInfo.position}</div>`
            num++
        }
    }
        
}

function screenWordle(number){
    const players = document.getElementsByClassName("inicio")[0];
    const board = document.getElementById(`game-board${number}`);
    const keyboard = document.getElementById(`keyboard-cont${number}`);
    const button = document.getElementById(`button${number}`);
    if (players.style.display != "none") {
        players.style.display = "none";
        board.style.display = "";
        keyboard.style.display = "";
        button.style.display = "";
        num = number
    } else {
        players.style.display = "";
        board.style.display = "none";
        keyboard.style.display = "none";
        button.style.display = "none";
        num = undefined
    }
}

function initBoard(number, letters) {
   surname_letters = letters
    
    let body = document.getElementsByTagName(`body`)[0];

    body.innerHTML += `
   
    <div id="game-board${number}" class="game-board" style="display: none;">

    </div>

    <div id="keyboard-cont${number}" class="keyboard-cont" style="display: none;">
        <div id="first-row${number}" class="first-row">
            <button class="keyboard-button keyboard-button${number}">q</button>
            <button class="keyboard-button keyboard-button${number}">w</button>
            <button class="keyboard-button">e</button>
            <button class="keyboard-button keyboard-button${number}">r</button>
            <button class="keyboard-button keyboard-button${number}">t</button>
            <button class="keyboard-button keyboard-button${number}">y</button>
            <button class="keyboard-button keyboard-button${number}">u</button>
            <button class="keyboard-button keyboard-button${number}">i</button>
            <button class="keyboard-button keyboard-button${number}">o</button>
            <button class="keyboard-button keyboard-button${number}">p</button>
        </div>
        <div id="second-row${number}" class="second-row">
            <button class="keyboard-button keyboard-button${number}">a</button>
            <button class="keyboard-button keyboard-button${number}">s</button>
            <button class="keyboard-button keyboard-button${number}">d</button>
            <button class="keyboard-button keyboard-button${number}">f</button>
            <button class="keyboard-button keyboard-button${number}">g</button>
            <button class="keyboard-button keyboard-button${number}">h</button>
            <button class="keyboard-button keyboard-button${number}">j</button>
            <button class="keyboard-button keyboard-button${number}">k</button>
            <button class="keyboard-button keyboard-button${number}">l</button>
        </div>
        <div id="third-row${number}" class="third-row">
            <button class="keyboard-button keyboard-button${number}">Del</button>
            <button class="keyboard-button keyboard-button${number}">z</button>
            <button class="keyboard-button keyboard-button${number}">x</button>
            <button class="keyboard-button keyboard-button${number}">c</button>
            <button class="keyboard-button keyboard-button${number}">v</button>
            <button class="keyboard-button keyboard-button${number}">b</button>
            <button class="keyboard-button keyboard-button${number}">n</button>
            <button class="keyboard-button keyboard-button${number}">m</button>
            <button class="keyboard-button keyboard-button${number}">Enter</button>
        </div>
    </div>
    <button id="button${number}" class="closeButton" onclick="screenWordle(${number})" style="display: none;">Cerrar</button>`
    

    let board = document.getElementById(`game-board${number}`)

        if (document.getElementById(`game-board${number}`).firstElementChild == null){
            for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
            let row = document.createElement("div")
            row.className = `letter-row letter-row${number}`

            for (let j = 0; j < letters; j++) {
                let box = document.createElement("div")
                box.className = `letter-box letter-box${number}`
                row.appendChild(box)
            }
    
            board.appendChild(row)
        }
    
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function deleteLetter () {
    let row = document.getElementsByClassName(`letter-row${num}`)[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess (rightGuessString, letters) {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != letters) {
        toastr.error("Not enough letters!")
        return
    }

    
    for (let i = 0; i < letters; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'green'
            } else {
                // shade box yellow
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}

function insertLetter (pressedKey, letters) {
    if (nextLetter === letters) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess(rightGuessString, 6)
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        if (surname_letters != undefined){
        insertLetter(pressedKey, surname_letters)
        }
    }
})

const keyboards = document.getElementsByClassName("keyboard-cont")

for (let i = 0; i < keyboards.length; i++){
    keyboards[i].addEventListener("click", (e) => {
        const target = e.target
        
        if (!target.classList.contains("keyboard-button")) {
            return
        }
        let key = target.textContent
    
        if (key === "Del") {
            key = "Backspace"
        } 
    
        document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
    })
}


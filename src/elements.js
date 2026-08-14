export const Elements = {
    buttons: {
        btnNewGame: document.getElementById("btn-new-game"),
        btnAxis: document.getElementById("btn-rotate"),
        btnStartBattle: document.getElementById("btn-start"),
    },

    newGame: {
        inputName: document.getElementById("input-player-name"),
        div: document.getElementById("div-new-game"),
    },
    gameArea: {
        div: document.getElementById("game-area"),
        divPlaceShips: document.getElementById("place-ships"),
        playerContField: document.querySelector(".container-field.player"),
        enemyContField: document.querySelector(".container-field.computer"),
    },
    statusBar: document.getElementById("status-bar"),
    btnRestart: document.getElementById("btn-restart")
}
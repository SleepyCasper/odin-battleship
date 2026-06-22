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
        ships: document.querySelectorAll("#ships .ship"),
        playerContField: document.querySelector(".container-field.player"),
        enemyContField: document.querySelector(".container-field.enemy"),
    },
    statusBar: document.getElementById("status-bar")
}
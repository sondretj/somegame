import {LevelOne} from "./LevelOne.js";
import {Player} from "./Player.js";

export class Game {

    LEVEL = {
        INITIAL: 0,
        PLAYER_1_COURT: 1,
        PLAYER_1_CASTLE: 2,
        PLAYER_2_COURT: 1,
        PLAYER_2_CASTLE: 2,
    }

    GAME_STATE = {
        START: 1,
        PAUSED: 2,
        INACTIVE: 3,
        ACTIVE: 4,
        START_SCREEN: 5
    }

    constructor() {
        this.boundsId = null;
        this.listenerId = null;
        this.gravityId = null;
        this.startScreenElement = document.getElementById("start_screen");
        this.levelElement = document.getElementById("level_container")
        this.startButton = document.getElementById("start_button");
        this.state = {
            level: this.LEVEL.INITIAL,
            gameState: this.GAME_STATE.START_SCREEN
        }
        this.level = null;

        this.playerOne = new Player("player1");
        this.listen()
        this.listenForRestart();
    }

    listenForRestart() {

        window.addEventListener("keyup", (event) => {
            if (event.code === "Escape") {
                this.state.gameState = this.GAME_STATE.START_SCREEN
            }
        })

    }


    listen() {
        this.startButton.addEventListener("click", () => {
            this.state.gameState = this.GAME_STATE.START
        })
        const handle = () => {
            switch (this.state.gameState) {
                case this.GAME_STATE.START_SCREEN:
                    this.startScreen();
                    break;
                case this.GAME_STATE.START:
                    this.start();
                    break;

            }

        }
        this.listenerId = setInterval(handle, 1)
    }

    startScreen() {
        clearInterval(this.gravityId);
        this.startScreenElement.style.opacity = "1";
    }

    loadLevel() {
        this.level = new LevelOne();
        this.level.load(this.levelElement)

    }

    injectPlayers() {
        this.playerOne.injectPlayer(this.level, 10, 10);
    }

    start() {
        this.startScreenElement.style.opacity = "0";
        this.state.gameState = this.GAME_STATE.ACTIVE;
        this.loadLevel();
        this.injectPlayers();
        this.gravity();
        this.bounds();

    }

    gravity() {
        this.gravityId = setInterval(() => {
            if (!this.level.isPlayerTouchingGround(this.playerOne)) {
                if (this.playerOne.state.velocityY <= 2) {
                    this.playerOne.state.velocityY += 0.25;
                }
            } else {
                this.playerOne.state.velocityY = 0;

            }

        })
    }

    bounds() {
        this.boundsId = setInterval(() => {
            // if (this.level.isPlayerTouchingLeftWall(this.playerOne) || this.level.isPlayerTouchingRightWall(this.playerOne)) {
            //     this.playerOne.stopX()
            // }



            //
            const correction = this.level.getPlayerOutOfBounds(this.playerOne);
            if (correction.y !== 0 || correction.x !== 0) {
                this.playerOne.move(this.playerOne.state.x + correction.x, this.playerOne.state.y + correction.y)
            }

        })
    }
}

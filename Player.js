export class Player {

    SWORD_DIR = {
        LEFT: 0,
        RIGHT: 1
    }
    constructor(name) {
        this.controllerId = null;
        this.jumpId = null;
        this.velocityId = null;
        this.playerElement = null;
        this.headElement = null;
        this.torsoElement = null;
        this.legsElement = null;
        this.swordElement = null;
        this.strikeTimeout = null;
        this.name = name;
        this.state = {
            diminishingReturnJump: 0,
            isJumping: false,
            isCrouching: false,
            x: 1,
            y: 1,
            velocityX: 0,
            velocityY: 0,
            swordDir: this.SWORD_DIR.RIGHT
        }

        this.keys = {}

        this.attachController();
    }

    createPlayerDOM() {
        const container = document.createElement("div")
        container.className = `${this.name} player container`;
        container.id = `${this.name}_container`;
        this.playerElement = document.getElementById(container.id);

        const inner = document.createElement("div")
        inner.className = `${this.name} player inner`;
        inner.id = `${this.name}_inner`;

        const head = document.createElement("div");
        head.className = `${this.name} player head`;
        head.id = `${this.name}_head`;
        this.headElement = document.getElementById(head.id);

        const torso = document.createElement("div");
        torso.className = `${this.name} player torso`;
        torso.id = `${this.name}_torso`;
        this.torsoElement = document.getElementById(torso.id);


        const legs = document.createElement("div");
        legs.className = `${this.name} player legs`;
        legs.id = `${this.name}_legs`;
        this.legsElement = document.getElementById(legs.id);

        const sword = document.createElement("div");
        sword.className = `${this.name} player sword right`;
        sword.id = `${this.name}_sword`;

        inner.appendChild(head);
        inner.appendChild(torso);
        inner.appendChild(legs);
        inner.appendChild(sword);

        container.appendChild(inner);

        return container;

    }

    initBodyElements() {
        this.playerElement = document.getElementById(`${this.name}_container`);
        this.headElement = document.getElementById(`${this.name}_head`);
        this.torsoElement = document.getElementById(`${this.name}_torso`);
        this.legsElement = document.getElementById(`${this.name}_legs`);
        this.swordElement = document.getElementById(`${this.name}_sword`);
    }

    injectPlayer(level, x, y) {

        // const playerDOM = document.createElement("div")
        // playerDOM.className = "player";
        // playerDOM.id = "player";

        const playerDOM = this.createPlayerDOM();
        this.level = level;
        this.level.levelContainer.appendChild(playerDOM)
        this.initBodyElements();
        this.velocity();
    }

    moveLeft() {
        if (this.level.isPlayerTouchingLeftWall(this)) {
            this.state.velocityX = 0;
            return

        }

        let incr = this.state.velocityX < 0 ? 0.25 : 0.1;
        if (this.state.isJumping) incr = 0.025;
        if (this.state.velocityX > -2) {
            this.state.velocityX -= incr;
        }             // this.move(this.state.x - 1)
    }

    moveRight() {

        if (this.level.isPlayerTouchingRightWall(this)) {
            this.state.velocityX = 0;
            return

        }
        let incr = this.state.velocityX < 0 ? 0.25 : 0.1;
        if (this.state.isJumping) incr = 0.025;

        if (this.state.velocityX < 2) {
            this.state.velocityX += incr;
        }
        // this.move(this.state.x + 1)
    }

    moveSword() {
        if (this.state.velocityX > 0 && this.state.swordDir !== this.SWORD_DIR.RIGHT) {
            this.swordElement.classList.add("right")
            this.swordElement.classList.remove("left")
            this.state.swordDir = this.SWORD_DIR.RIGHT

            // setTimeout(() => {
            //     this.swordElement.style.removeProperty("transform")
            // }, 200);

        } else if (this.state.velocityX < 0 && this.state.swordDir !== this.SWORD_DIR.LEFT) {
            this.swordElement.classList.add("left")
            this.swordElement.classList.remove("right")
            this.state.swordDir = this.SWORD_DIR.LEFT

        }

    }

    move(x = this.state.x, y = this.state.y) {
        this.state.x = Math.floor(x);
        this.state.y = Math.floor(y);

        this.moveSword();

        this.playerElement.setAttribute("style", `transform: translate3d(${this.state.x}px, ${this.state.y}px, 0px);`)
    }

    jump() {


        if (!this.state.isJumping && this.state.diminishingReturnJump === 0) {
            this.jumpId = setInterval(() => {
                if (this.level.isPlayerTouchingGround(this)) {
                    this.state.isJumping = false;
                    this.state.diminishingReturnJump = this.keys["ArrowUp"] ? 1 : 0;
                    setTimeout(() => {
                        this.state.diminishingReturnJump = 0;
                    }, 300)
                    clearInterval(this.jumpId)
                }
            }, 100)
            this.state.velocityY = -6;
            this.state.isJumping = true;
        }
        // if (this.state.isJumping && this.state.velocityY > - 4) {
        //     this.state.velocityY -= 0.2
        // }
    }

    fall() {

    }

    stopX() {
        this.state.velocityX = 0;
    }

    stopY() {
        this.state.velocityY = 0;
    }

    crouch() {

        if (this.level.isPlayerTouchingGround(this)) {
            this.playerElement.classList.add("crouch")
            this.state.isCrouching = true;



            // this.torsoElement.style.height = 0;
            // this.state.isCrouching = true;
            // this.state.y -= 30;
            // this.move()

        }
        // get torso and remove
        // this.playerElement.style.height = "30px";
    }

    stand() {
        this.playerElement.classList.remove("crouch")



        //attach torso
        // this.playerElement.style.height = "50px";

    }

    strike() {
        clearTimeout(this.strikeTimeout)
        this.swordElement.classList.remove("strike")
        this.swordElement.classList.add("strike")
        setTimeout(() => {
            this.swordElement.classList.remove("strike")
        }, 50);

    }

    velocity() {
        this.velocityId = setInterval(() => {
            const xGain = (this.state.velocityX * 2) + this.state.x;
            const yGain = this.state.velocityY * 2 + this.state.y;
            this.move(xGain, yGain)
        })
    }

    attachController() {
        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    e.preventDefault();
                    this.keys[e.code] = true;
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    this.keys[e.code] = true;
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    this.keys[e.code] = true;
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    this.keys[e.code] = true;
                    break;
                // case "Period": this.keys[e.code] = true; break;
            }
        });

        window.addEventListener("keypress", (e) => {
            switch (e.code) {
                case "Period":
                    e.preventDefault();

                    this.strike();
                    break;
                // case "Period": this.keys[e.code] = true; break;
            }
        });


        window.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    delete this.keys[e.code];
                    break;
                case "ArrowRight":
                    delete this.keys[e.code];
                    break;
                case "ArrowUp":
                    delete this.keys[e.code];
                    break;
                case "ArrowDown":
                    delete this.keys[e.code];
                    break;
                // case "Period": delete this.keys[e.code]; break;

            }
        });

        this.controllerId = setInterval(() => {
            if (this.keys["ArrowLeft"]) this.moveLeft();
            else if (this.keys["ArrowRight"]) this.moveRight();
            if (this.keys["ArrowUp"]) this.jump();

            if (this.keys["ArrowDown"]) this.crouch();
            else if (this.state.isCrouching) this.stand();

            if (!this.keys["ArrowRight"] && !this.keys["ArrowLeft"] && !this.state.isJumping) {
                this.stopX()
            }
        })

    }
}

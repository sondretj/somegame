export const html = `
<div class="level_one_floor">

</div>

`


export class LevelOne {

    constructor() {
        this.levelContainer = null;
        this.floorElement = null;
    }

    html() {
        return  `
<div id="level_one_floor" class="level_one_floor">

</div>

`

    }

    load(levelContainer) {
        levelContainer.innerHTML = this.html();
        this.floorElement = document.getElementById("level_one_floor")
        this.levelContainer = levelContainer;

    }

    isPlayerTouchingGround(player) {
        const floorRect = this.floorElement.getBoundingClientRect();
        const playerRect = player.playerElement.getBoundingClientRect();

        if (Math.floor(playerRect.bottom) < Math.floor(floorRect.top)) {
            return false;
        }
        return true;

    }

    isPlayerTouchingLeftWall(player) {
        const levelContainerRect = this.levelContainer.getBoundingClientRect();
        const playerRect = player.playerElement.getBoundingClientRect();

        if (Math.floor(playerRect.left) <= Math.floor(levelContainerRect.left)) {
            console.log("TOUCHGIN LEFT")
            return true
        }
        return false;

    }
    isPlayerTouchingRightWall(player) {
        const levelContainerRect = this.levelContainer.getBoundingClientRect();
        const playerRect = player.playerElement.getBoundingClientRect();

        if (Math.floor(playerRect.right) >= Math.floor(levelContainerRect.right)) {
            return true
        }
        return false;

    }

    getPlayerOutOfBounds(player) {
        const floorRect = this.floorElement.getBoundingClientRect();
        const playerRect = player.playerElement.getBoundingClientRect();


        const correctCoordinates = {
            x: 0,
            y: 0
        }
        const playerBottom = Math.floor(playerRect.bottom);
        const floorTop = Math.floor(floorRect.top);
        const playerLeft = Math.floor(playerRect.left);
        const playerRight = Math.floor(playerRect.right);
        const floorLeft = Math.floor(floorRect.left);
        const floorRight = Math.floor(floorRect.right);


        if (playerBottom > floorTop) {
            correctCoordinates.y =  floorTop - playerBottom;
        }

        if (playerLeft < floorLeft) {
            correctCoordinates.x = floorLeft - playerLeft
        } else if (playerRight > floorRight) {
            correctCoordinates.x =  floorRight - playerRight
        }
        return correctCoordinates;
    }

}
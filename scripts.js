// Настройка холста
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

// Class TILE
function floor(x, height){
    this.x = x;
    this.width = 700;
    this.height = height;
}

let world = {
    width: 640,
    height: 480,
    gravity: 10,
    highestFloor: 240,
    speed: 5,
    distanceTravelled: 0,
    autoScroll: true,
    floorTiles:[
        new floor(0, 140)
    ],
    stop: function(){
        this.autoScroll = false;
    },
    moveFloor: function(){
        for(i in this.floorTiles){
            let tile = this.floorTiles[i];
            tile.x -= this.speed;
            this.distanceTravelled += this.speed;
        }
    },
    addFutureTiles: function(){
        if (this.floorTiles.length >= 3) return;
        let previousTile = this.floorTiles[this.floorTiles.length - 1];
        let randomHeight = Math.floor(Math.random() * this.highestFloor) + 20;
        let leftValue = (previousTile.x + previousTile.width);
        let next = new floor(leftValue, randomHeight);
        this.floorTiles.push(next);
    },
    cleanOldTiles: function(){
        for(i in this.floorTiles){
            if(this.floorTiles[i].x <= -this.floorTiles[i].width)    this.floorTiles.splice(i,1);
        }
    },
    getDistanceToFloor: function(playerX){
        for(i in this.floorTiles){
            let tile = this.floorTiles[i];
            if(tile.x <= playerX && tile.x + tile.width >= playerX) return tile.height;
        }
        return -1;
    },
    tick: function(){
        if(!this.autoScroll) return;
        this.cleanOldTiles();
        this.addFutureTiles();
        this.moveFloor();
    },
    draw: function(){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
        let tile = null;
        let y = 0;
        for(let i in this.floorTiles){
            tile = this.floorTiles[i];
            y = world.height - tile.height;
            ctx.fillStyle = "blue";
            ctx.fillRect(tile.x, y, tile.width, tile.height);
        }
    }
};


let player = {
    x: 160,
    y: 340,
    width: 20,
    height: 20,
    downwardForce: world.height,
    jumpHeight: 0,
    getDistanceFor: function(x){
      let platformBelow = world.getDistanceToFloor(x);
      return world.height - this.y - platformBelow;
    },
    applyGravity: function(){
        this.currentDistanceAboveGround = this.getDistanceFor(this.x);
        let rightHandSideDistance = this.getDistanceFor(this.x + this.width);
        if(this.currentDistanceAboveGround < 0 || rightHandSideDistance < 0){
            world.stop();
        }
    },
    processGravity: function(){
        this.y += world.gravity;
        let floorHeight = world.getDistanceToFloor(this.x, this.y);
        let topYofPlatform = world.height - floorHeight;
        if(this.y > topYofPlatform){
            this.y = topYofPlatform;
        }
    },
    keyPress: function(keyInfo){
        let floorHeight = world.getDistanceToFloor(this.x, this.width);
        let onTheFloor = floorHeight == (world.height - this.y);
        if(onTheFloor) this.downwardForce = -8;
    },
    tick: function(){
        this.processGravity();
        this.applyGravity();
    },
    draw: function(){
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y - player.height, this.height, this.width);
    }
};

window.addEventListener("keypress", function(keyInfo){player.keyPress(keyInfo);}, false)
function tick(){
    player.tick();
    world.tick();
    world.draw();
    player.draw();
    window.setTimeout("tick()", 1000/60);
}
tick();


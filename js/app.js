'use strict';
//********ENEMY CLASS********//
const Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 10;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    //Enemies re-enter the screen after leaving
    reEnter(this);
    //Collision detector with player
    detectCollision(this);

    //Sets speed for each enemy lane
    setEnemySpeed(this);
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//********ENEMY HELPER FUNCTIONS********//
//Enemies re-enter the screen after leaving
function reEnter(object){
  if(object.x > 500){
    object.x = -100;
    object.y = (Math.floor(Math.random()*3) * 100) +20;
  }
}
//Collision detector with player
function detectCollision(object){
  if(Math.abs(object.x - player.x) <= 40 && Math.abs(object.y - player.y) <=50 && player.y <270){
    console.log('hit')
    player.x = 200;
    player.y = 370;
    player.lives -= 1;
    loseCondition(player);
  }
}
//Sets speed for each enemy lane
function setEnemySpeed(object){
  if(object.y === 20){
    object.speed = 200;
  }else if(object.y ===120){
    object.speed = 300;
  }else{
    object.speed = 250;
  }
}

//********PLAYER CLASS********//

const Player = function() {
    //Initial player position
    this.x = 200;
    this.y = 370;

    //Player points
    this.points = 0;

    //Player lives
    this.lives = 3;

    //Player sprite image
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt){
  winCondition(this);

  handleOutOfBounds(this);

}


Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key){
  if(key === 'up'){
    this.y -= 50;
  }else if(key === 'down'){
    this.y +=50;
  }else if(key === 'left'){
    this.x -= 100;
  }else{
    this.x += 100;
  }
}

//********PLAYER HELPER FUNCTIONS********//

//Player wins if they reach the water. Resets player to initial spot.
function winCondition(player){
  if(player.y <=0){
      player.x = 200;
      player.y = 370;
      player.points += 100;
      displayMessage();
  }
}

function displayMessage(){
  let message = document.querySelector('h1');
  message.classList.toggle('hidden');
  window.setTimeout(function(){
    message.classList.toggle('hidden');
  }, 3000)
}

//Stops player from going out of bounds.
//If out of bounds x, player will transport to other side.
function handleOutOfBounds(player){
  if(player.y > 370){
    player.y = 370;
  }else if(player.x <0){
    player.x = 400;
  }else if(player.x > 400){
    player.x = 0;
  }
}

//Sets losing condition for further development
function loseCondition(player){
  if(player.lives === 0){
    player.x = 0;
    console.log('You lose');
  }
}


//********GEM CLASS********//
const Gem  = function(){
  this.x = Math.floor(Math.random()*5) *100;
  this.y = (Math.floor(Math.random()*3) * 100)+25;


  this.sprite = 'images/Gem Blue.png';
}

Gem.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Gem.prototype.update = function(dt){
  collectGem(this);
}

//********GEM HELPER FUNCTIONS********//
function collectGem(gem){
  if(Math.abs(player.x-gem.x) <= 40 && Math.abs(player.y-gem.y) <= 40){
    player.points += 100;
    gem.x = 1000;
    console.log('GEM');
  }
}

//********OBJECT INSTANTIATION********//

//Instatiate Enemies
function createEnemies(num, arr){
  let enemies = [];
  for(let i = 0; i < num; i ++){
    enemies[i] = new Enemy(Math.floor(Math.random() * 500), (Math.floor(Math.random()*3) * 100) +20);
    arr.push(enemies[i]);
  }
}

let allEnemies = [];
createEnemies(5, allEnemies);

//Instantiate Player
let player = new Player();

//Instantiate gem
let gem = new Gem();

let reset = document.querySelector('.reset');

reset.addEventListener('click', function(){
  player.lives = 3;
  player.points = 0;
  player.x = 200;
  player.y = 370;
})

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

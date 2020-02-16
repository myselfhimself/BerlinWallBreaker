var board;
var ball;
var bricks = [];

var homeText;
var nextLevelText;
var retryText;
var gameFinishedText;

var drops = [];
var GAME_LEVEL = 0;
var GAME_LEVEL_MAX = 3;

var DEFAULT_BRICKS_COUNT = 20;
var DEFAULT_DROPS_COUNT = 20;

var GAME_STATE_HOME_BANNER = 0;
var GAME_STATE_PLAYING = 1;
var GAME_STATE_RETRY_BANNER = 2;
var GAME_STATE_NEXT_LEVEL_BANNER = 3;
var GAME_STATE_FINISHED_BANNER = 4;
var GAME_STATE = GAME_STATE_HOME_BANNER;

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupBg();
  ellipseMode(CENTER);
  textAlign(CENTER);
  noFill();
  stroke(0);

  board = new Board();
  ball = new Ball();

  setupBricks();
  createText();
  homeText.show();
}

function setupBg() {
  if (GAME_LEVEL) { /* TODO MORE LOGIC HERE */}
  bg = loadImage('assets/level' + (GAME_LEVEL + 1).toString() + '.png');
  //bg = 255/(GAME_LEVEL+1); 
}

function setupDrops() {
  if (GAME_LEVEL) { /* TODO MORE LOGIC HERE */}
  for (var i = 0; i < DEFAULT_DROPS_COUNT; i++) {
    drops[i] = new Drop(Math.floor(random(5)));
  }
}

function setupBricks() {
  if (GAME_LEVEL) { /* TODO MORE LOGIC HERE */}
  if(bricks.length < DEFAULT_DROPS_COUNT) createBricks(DEFAULT_BRICKS_COUNT);
}

function draw() {
  background(bg);
  console.log("state:" + GAME_STATE.toString() + " level:" + GAME_LEVEL.toString());
  if (GAME_STATE == GAME_STATE_HOME_BANNER) {
    homeText.show();
    board.display();
  } else if (GAME_STATE == GAME_STATE_PLAYING) {
    homeText.hide();
    retryText.hide();
    nextLevelText.hide();
    // bricks
    for (var i = bricks.length - 1; i >= 0; i--) {
      if (ball.hits(bricks[i])) {
        if (bricks[i].r >= 40) {
          var newBricks = bricks[i].shrink();
          bricks = bricks.concat(newBricks);
        }
        bricks.splice(i, 1);
        ball.direction.y *= -1;
        break;
      }
      bricks[i].display();
    }

    // board
    board.display();
    board.checkEdges();
    board.update();

    // ball
    if (ball.meets(board)) {
      if (ball.direction.y > 0) ball.direction.y *= -1;
    }
    ball.display();
    ball.checkEdges();
    ball.update();

    if (ball.pos.y > height) {
      ball.pos = createVector(board.pos.x + board.r, height - 500);
      GAME_STATE = GAME_STATE_RETRY_BANNER; 
      ball.shadows = [];
    }

    if (bricks.length === 0) {
      GAME_LEVEL++;
      GAME_STATE = GAME_LEVEL < GAME_LEVEL_MAX ? GAME_STATE_NEXT_LEVEL_BANNER : GAME_STATE_FINISHED_BANNER;
    }
  } else if(GAME_STATE == GAME_STATE_RETRY_BANNER) {
    retryText.show();
  } else if(GAME_STATE == GAME_STATE_NEXT_LEVEL_BANNER) {
    updateNextLevelText();
    nextLevelText.show();  
    for (var i = 0; i < drops.length; i++) {
      drops[i].fall();
      drops[i].show();
    }
    setupBricks();
 
  } else if(GAME_STATE == GAME_STATE_FINISHED_BANNER) {
    gameFinishedText.show();
  }
}

function keyReleased() {
  board.isMovingRight = false;
  board.isMovingLeft = false;
}

function keyPressed() {
  if (key === 'a' || key === 'A') {
    board.isMovingLeft = true;
  } else if (key === 'd' || key === 'D') {
    board.isMovingRight = true;
  } else if (key === 's' || key === 'S') {
    if (GAME_STATE == GAME_STATE_HOME_BANNER || GAME_STATE == GAME_STATE_RETRY_BANNER || GAME_STATE == GAME_STATE_NEXT_LEVEL_BANNER) {
      GAME_STATE = GAME_STATE_PLAYING;
    }
  }
	// TODO REMOVE HACK
else if (key == 'j') {
    bricks.pop(); 
  }
}

function createBricks(n) {
  for (var i = 0; i < n; i++) {
    bricks.push(new Brick());
  }
}

function updateNextLevelText() {
  nextLevelText.html("🎉🎉🎉 TRES BIEN! APPUIE SUR 'S' POUR PASSER AU NIVEAU " + (GAME_LEVEL+1).toString() + ' 🎉🎉🎉');
}

function createText() {
  homeText = createP("APPUIE SUR 'S' POUR COMMENCER, 'A'/'D' POUR TE DEPLACER A DROITE/GAUCHE");
  homeText.hide();
  homeText.style('box-shadow', '10px 5px 5px red');
  homeText.position(width / 2 - 240, 100);

  nextLevelText = createP();
  nextLevelText.hide();
  nextLevelText.style('box-shadow', '10px 5px 5px red');
  nextLevelText.position(width / 2 - 130, 80);
  updateNextLevelText();

  retryText = createP();
  retryText.html("APPUIE SUR 'S' POUR REPRENDRE, 'A'/'D' POUR TE DEPLACER A DROITE/GAUCHE");
  retryText.hide();
  retryText.style('box-shadow', '10px 5px 5px red');
  retryText.position(width / 2 - 240, 100);

  gameFinishedText = createP("Bravo d'avoir cassé tous ces p'tit murs de Berlin!!");
  gameFinishedText.hide();
  gameFinishedText.style('box-shadow', '10px 5px 5px red');
  gameFinishedText.position(width / 2 - 240, 120);
}

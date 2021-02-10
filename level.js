// Forked from https://molleindustria.github.io/p5.play/examples/index.html?fileName=breakout.js
//
//breakout close (core mechanics)
//mouse to control the paddle, click to start

var LEVELS_DATA = [
    {
        bricks: {
            count: 10
        },
        nextUrlSlug: "intro1",
    },
    {
        bricks: {
            count: 10
        },
        nextUrlSlug: "intro2",
    },
    {
        bricks: {
            count: 10
        },
        nextUrlSlug: "win",
    }
];

var paddle, ball, wallTop, wallBottom, wallLeft, wallRight;
var BALL_DIAMETER = 20; // 11
var bricks;
var MAX_SPEED = 9;
var WALL_THICKNESS = 0;
var BRICK_W = 80;
var BRICK_H = 80;
var BRICK_MARGIN = 4;
var ROWS = 2;
var COLUMNS = 5;

var cog1;

function preload() {
    cog1 = loadImage('cog1.png');
}

function setup() {
    setupCanvas(false);

    paddle = createSprite(width / 2, height-11, 110, 20);
    paddle.setCollider('rectangle');
    paddle.debug = true;
    paddle.immovable = true;

    wallTop = createSprite(width / 2, -WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS);
    wallTop.immovable = true;
    wallTop.debug = true;

    wallBottom = createSprite(width / 2, height + WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS);
    wallBottom.immovable = true;
    wallBottom.debug = true;

    wallLeft = createSprite(-WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height);
    wallLeft.immovable = true;
    wallLeft.debug = true;

    wallRight = createSprite(width + WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height);
    wallRight.immovable = true;
    wallRight.debug = true;

    cogs = new Group();

    for (let h = 0; h < 2; h++) {
        for (let w = 0; w < 5; w++) {
            cog = createSprite(width / 10 + w * cog1.width * 0.8, height / 10 + h * cog1.height * 0.8, 0, 0);
            let cogRotDirection = (w % 2 == 0 ? -1 : 1) * (h % 2 == 0 ? -1 : 1);
            cog.rotation += 10;
            cog.rotationSpeed = 3 * cogRotDirection;
            cog.debug = true;
            cog.addImage(cog1);
            cog.setCollider('circle');
            cog.immovable = true;
            cogs.add(cog);
        }
    }

    bricks = new Group();

    var offsetX = width / 2 - (COLUMNS - 1) * (BRICK_MARGIN + BRICK_W) / 2;
    var offsetY = 80;

    for (var r = 0; r < ROWS; r++)
        for (var c = 0; c < COLUMNS; c++) {
            var brick = createSprite(offsetX + c * (BRICK_W + BRICK_MARGIN), offsetY + r * (BRICK_H + BRICK_MARGIN), BRICK_W, BRICK_H);
            brick.draw = function () {
                ellipse(0, 0, BRICK_W, BRICK_H);
            };
            brick.setCollider('circle');
            brick.debug = true;
            brick.shapeColor = color(255, 255, 255);
            bricks.add(brick);
            brick.immovable = true;
        }

    //the easiest way to avoid pesky multiple collision is to
    //have the ball bigger than the bricks
    ball = createSprite(width / 2, height - 200, 11, 11);
    ball.draw = function () {
        ellipse(0, 0, 30, 30);
    };
    ball.setCollider('circle');
    ball.debug = true;
    ball.maxSpeed = MAX_SPEED;
    paddle.shapeColor = ball.shapeColor = color(255, 255, 255);

}

function mouseClicked() {
    print([mouseX, mouseY]);
}

function draw() {
    background(247, 134, 131);

    paddle.position.x = constrain(mouseX, paddle.width / 2, width - paddle.width / 2);

    ball.bounce(wallTop);
    ball.bounce(wallLeft);
    ball.bounce(wallRight);

    if (ball.bounce(paddle)) {
        var swing = (ball.position.x - paddle.position.x) / 3;
        console.log(ball.getDirection());
        // Flip direction (ie. angle) if positive
        // positive direction values may occur at the very beginning if the paddle center and ball center get very close
        // in such a situation, the ball would pass through the paddle downwards after a horizontal slide..
        let newDirection = ball.getDirection();
        if(newDirection > 0) {
            newDirection *= -1.0;
            print("flipped");
        }
        ball.setSpeed(MAX_SPEED, newDirection + swing);
        console.log(ball.getDirection() + swing);
    }

    ball.bounce(bricks, brickHit);
    ball.bounce(cogs, cogHit);

    drawSprites();

    gameLogic();
}

function gameLogic() {
    if (bricks.length == 0) {
        BWB_GAME_STATE = BWB_GAME_STATE_WIN;
    }

    //if (ball.collide(wallBottom)) {
    //    BWB_GAME_STATE = BWB_GAME_STATE_LOSE;
    //}

    switch (BWB_GAME_STATE) {
        case BWB_GAME_STATE_WIN:
            redirectToUrlFor(LEVELS_DATA[BWB_LEVEL_ID].nextUrlSlug);
            break;
        case BWB_GAME_STATE_LOSE:
            redirectToGameOver();
    }
}

function keyReleased() {
    if (keyCode == 87) { // W
        BWB_GAME_STATE = BWB_GAME_STATE_WIN;
    } else if (keyCode == 76) { // L
        BWB_GAME_STATE = BWB_GAME_STATE_LOSE;
    }
}

function mousePressed() {
    if (ball.velocity.x == 0 && ball.velocity.y == 0)
        ball.setSpeed(MAX_SPEED, random(90 - 10, 90 + 10));
}

function brickHit(ball, brick) {
    brick.remove();
}

function cogHit(ball, cog) {
    print("hit cog");
    cog.remove();
}


function Brick(pos, r) {
  if (pos) {
    this.pos = pos.copy();
  } else {
    var first = GAME_LEVEL_POLES[GAME_LEVEL].first;
    var second = GAME_LEVEL_POLES[GAME_LEVEL].second;
    this.pos = createVector(
	    random(
		    min(first.x, second.x),
		    max(first.x, second.x)
	    )*width,
	    random(
		    min(first.y, second.y),
		    max(first.y, second.y)
	    )*height
    );
    //this.pos = createVector(random(100, width - 100), random(100, height - 400));
  }
  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(20, 80);
  }

  this.total = 6;
  this.offset = [];
  this.index = Math.floor(random(5));
  this.colors = ['#6CD9CC', '#FB6578', '#FE5A8F', '#FC9574', '#9A8DF2'];
  this.miniDrops = [];
  var glbi = GAME_LEVEL_BRICK_IMAGES[GAME_LEVEL][Math.floor(random(0, GAME_LEVEL_BRICK_IMAGES[GAME_LEVEL].length))];
  this.symbolImage = loadImage(glbi);

  this.display = function() {
    push();
    image(this.symbolImage, this.pos.x, this.pos.y, this.r*2, this.symbolImage.height/this.symbolImage.width*this.r*2);
    // var brick_color = this.colors[this.index];
    // stroke(brick_color);
    // strokeWeight(2);
    translate(this.pos.x, this.pos.y);

    // fill(brick_color);
    // beginShape();
    // for (var i = 0; i < this.total; i++) {
    //   var angle = map(i, 0, this.total, 0, TWO_PI);
    //   var r = this.r;
    //   var x = r * cos(angle);
    //   var y = r * sin(angle);
    //   vertex(x, y);
    // }
    // endShape(CLOSE);
    // stroke(0);
    // strokeWeight(1);
    pop();

  }

  this.shrink = function() {
    var newB = [];
    newB[0] = new Brick(this.pos, this.r);
    // newB[1] = new Brick(this.pos, this.r);
    return newB;
  }

}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(500);

  noStroke();
  fill(0, 240, 0);
  rect(0, 0, 200, 100);

  stroke(0, 0, 0);
  fill(500, 500, 500);
  circle(50, 50, 80, 80);
  
  fill(500, 500, 500);
  square(110, 10, 80);
}

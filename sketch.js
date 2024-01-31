function setup() {
  createCanvas(1600, 1600);
}

function draw() {
  background(500);

  noStroke();
  fill('lime');
  rect(0, 0, 200, 100);

  stroke(0);
  strokeWeight(1);
  fill(500, 500, 500);
  circle(50, 50, 80, 80);
  
  fill(500, 500, 500);
  square(110, 10, 80);



  noStroke();
  fill(255, 255, 0, 120);
  circle(110, 205, 80, 80);

  noStroke();
  fill(500, 0, 0, 120);
  circle(85, 160, 80, 80);

  noStroke();
  fill(0, 0, 5000, 120);
  circle(60, 205, 80, 80);



  noStroke();
  fill('black');
  rect(200, 0, 200, 100);

  fill('yellow');
  circle(250, 50, 80, 80);

  fill('black');
  triangle(250, 50, 200, 0, 200, 100);
  
  fill('red');
  rect(310, 10, 80, 80, 80, 80, 0, 0);

  fill('white');
  circle(330, 50, 25, 25);

  fill('blue');
  circle(330, 50, 15, 15);

  fill('white');
  circle(370, 50, 25, 25);

  fill('blue');
  circle(370, 50, 15, 15);

  

  fill('darkblue');
  square(200, 100, 200);

  stroke(500);
  strokeWeight(3);
  fill('green');
  circle(300, 200, 100, 100);

  fill('red');
  beginShape();
    vertex(300,148);
    vertex(313,185);
    vertex(348,185);
    vertex(320,210);
    vertex(327,242);

    vertex(300,220);

    vertex(273,242);
    vertex(280,210);
    vertex(252,185);
    vertex(287,185);
    vertex(300,148);
  endShape();
}
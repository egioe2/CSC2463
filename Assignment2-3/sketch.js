let noise = new Tone.Noise("white");
let filter = new Tone.Filter(5,"lowpass");

noise.connect(filter);
filter.toDestination();

function preload()
{
  cnv = loadImage('assets/BlockBreak.png');
}

function setup() 
{
  createCanvas(400, 400);
}

function mousePressed()
{
  noise.start();
}

function mouseReleased()
{
  noise.stop();
}

function draw() 
{
  if(mouseIsPressed === true)
  {
    background(cnv);
    filter.frequency.rampTo(10,.5);
  } 
  else if(mouseIsPressed === false)
  {
    background(100);
    text('Click and hold mouse', 150, 150);
    filter.frequency.value = 500;
  }
}

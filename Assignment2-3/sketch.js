let noise = new Tone.Noise("white");
let filter = new Tone.Filter(5,"lowpass");

noise.connect(filter);
filter.toDestination();

function preload()
{
  cnv = loadImage('assets/BlockBreak.png')
}

function setup() 
{
  createCanvas(400, 400);
}

function draw() 
{
  if(mouseIsPressed === true)
  {
    background(cnv);
    noise.start();
    filter.frequency.rampTo(10,.1);
  } 
  else if(mouseIsPressed === false)
  {
    background(20,70,60);
    text('Click and hold mouse', 150, 150);
    noise.stop();
    filter.frequency.value = 1000;
  }
}

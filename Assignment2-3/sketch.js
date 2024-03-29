function preload(){
 mario = loadImage ('assets/blockbreak.jpg')
}

function setup() {
  createCanvas(400, 400); 
}

function draw() {
  if (mouseIsPressed ===true){
    background(mario);
  } else if (mouseIsPressed === false){
    background (100);
    text ('Click and hold mouse', 150, 150);
  }
}

   
//Your assignment needs to use objects from Tone.js not preexisitng sound files!
let noise = new Tone.Noise("white"); // pink, brown, or white
let filter = new Tone.Filter (500, "lowpass"); // highpass, lowpass, bandpass. First argument is the frequency cutoff.

noise.connect(filter);
filter.toDestination();

function mousePressed() { 
  noise.start();
  filter.frequency.rampTo(10,1); 
}

function mouseReleased() { 
  noise.stop();
  filter.frequency.value = 500;
} 


  
let sounds = new Tone.Players
({
  'bells' : 'assets/bells.mp3',
  'chicken' : 'assets/chicken.mp3',
  'crowd' : 'assets/crowd.mp3',
  'clapping' : 'assets/clapping.mp3'
});

let delAmt = new Tone.FeedbackDelay("8n", 0.5);

let button1, button2, button3, button4;
let delaySlider;

sounds.connect(delAmt);
delAmt.toDestination();

function setup() 
{
  createCanvas(400, 400);

  button1 = createButton('Bells');
  button1.position(40,80);
  button1.mousePressed(() =>sounds.player('bells').start());
 
  button2 = createButton('Chicken');
  button2.position(120,80);
  button2.mousePressed(() =>sounds.player('chicken').start());

  button3 = createButton('Crowd');
  button3.position(200,80);
  button3.mousePressed(() =>sounds.player('crowd').start());

  button4 = createButton('Clapping');
  button4.position(280,80);
  button4.mousePressed(() =>sounds.player('clapping').start());

  delaySlider = createSlider(0, 1, 0, 0.05);
  delaySlider.position(90, 120);
  delaySlider.mouseMoved(() => delAmt.delayTime.value = delaySlider.value());
}

function draw() 
{
  background(0);
  textSize(10);

  fill(255);
  text("Feedback Delay", 120, 150);
}

let synth = new Tone.PolySynth(Tone.DuoSynth);
let bend = new Tone.PitchShift();
let delAmt = new Tone.FeedbackDelay("8n", 0.5);

bend.pitch = 4;
synth.connect(bend);
bend.connect(delAmt);
delAmt.toDestination();


function setup() 
{
  createCanvas(400, 400);

  pitchSlider = createSlider(0,12,0,0.3);
  pitchSlider.position(120,200);
  pitchSlider.mouseMoved(()=> bend.pitch = pitchSlider.value());

  delaySlider = createSlider(0, 1, 0, 0.05);
  delaySlider.position(120, 120);
  delaySlider.mouseMoved(() => delAmt.delayTime.value = delaySlider.value());

  text('Press keys A through K to play');

}

let notes =
{
  'a' : 'C4',
  's' : 'D4',
  'd' : 'E4',
  'f' : 'F4',
  'g' : 'G4',
  'h' : 'A4',
  'j' : 'B4',
  'k' : 'C5'
}

function keyPressed()
{
  let playNotes = notes[key];
  synth.triggerAttack(playNotes);
}

function keyReleased()
{
  let playNotes = notes[key];
  synth.triggerRelease(playNotes, '+0.03');
}

function draw() {
  background(160, 60, 120);

  text('Press keys A through K to play', 120, 30);
  text('Feedback Delay', 120, 110);
  text('Pitch Bend', 120, 190);
}

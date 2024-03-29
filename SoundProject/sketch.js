let selectedColor;
let palette;
let x;
let y; 
let bgm = new Tone.Player("assets/BGM.mp3").toDestination();
bgm.loop = true;
bgm.playbackRate = 1;

function setup() 
{
  bgm.start();

  selectedColor = color('white');
  createCanvas(700, 700);

  palette = 
  [
    new Palette(0,0,color('red')),
    new Palette(0,30,color('orange')),
    new Palette(0,60,color('yellow')),
    new Palette(0,90,color('lime')),
    new Palette(0,120,color('cyan')),
    new Palette(0,150,color('blue')),
    new Palette(0,180,color('magenta')),
    new Palette(0,210,color('brown')),
    new Palette(0,240,color('white')),
    new Palette(0,270,color('black'))];
}

function draw()
{
  for(let i = 0; i < palette.length; i++)
  {
    palette[i].draw();
  }

  strokeWeight(10);

  if(mouseIsPressed && (mouseX > 35 || mouseY > 305))
  {
    stroke(selectedColor);
    line(mouseX,mouseY,pmouseX,pmouseY);
  }
}

function mousePressed()
{
  for(let i = 0; i < palette.length; i++)
  {
    if(palette[i].contains(mouseX,mouseY))
    {
      selectedColor = palette[i].fill;
    }
  }
}

class Palette
{
  constructor(x,y,fill)
  {
    this.x = x;
    this.y = y;
    this.fill = fill;
  }

  draw()
  {
    stroke(255);
    strokeWeight(1);
    fill(this.fill);
    square(this.x, this.y, 30);
  }

  contains(x,y)
  {
    let insideX = x >= this.x && x<= this.x + 30;
    let insideY = y >= this.y && x<= this.y + 30;
    return insideX && insideY;
  }
}

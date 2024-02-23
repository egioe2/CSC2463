let sprite;
let characters = [];
let positions = [100,200,300];

function preload()
{
  let animations = 
    {
      stand: {row: 0, frames: 1},
      walkRight: {row: 0, col: 1, frames: 8}
    };

    characters.push (new Character(random(401),random(positions),80,80,'assets/blue.png',animations));
    characters.push (new Character(random(401),random(positions),80,80,'assets/red.png',animations));
    characters.push (new Character(random(401),random(positions),80,80,'assets/yellow.png',animations));
}

function setup() 
{
  createCanvas(400, 400);
}

function draw() 
{
  background(255);
 
  noStroke();
  fill(180);
  square(0,131,400);

  fill(140);
  square(0,231,400);

  fill(100);
  square(0,331,400);

  characters.forEach((character) => {
    if (kb.pressing(RIGHT_ARROW) && character.sprite.x < 401)
    {
      character.walkRight();
    }

    else if (kb.pressing(LEFT_ARROW) && character.sprite.x > 0)
    {
      character.walkLeft();
    }

    else
    {
      character.stop();
    }
  })

  
}

class Character 
{
  constructor(x,y,width,height,spriteSheet,animations) 
  {
    this.sprite = new Sprite(x,y,width,height);
    this.sprite.spriteSheet = spriteSheet;
    
    this.sprite.anis.frameDelay = 8;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('stand');
  }

  stop()
  {
    this.sprite.vel.x = 0;
    this.sprite.changeAni('stand');
  }

  walkRight()
  {
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = 1;
    this.sprite.scale.x = 1;
  }

  walkLeft()
  {
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = -1;
    this.sprite.scale.x = -1;
  }
}


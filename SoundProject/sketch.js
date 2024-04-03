let sprite;
let bugs = [];
let score = 1;
let timeRemaining = 30;
let gameOver = false;
let startScreen = true;
let startButton;

let bgm = new Tone.Player("assets/bgm.mp3").toDestination();
bgm.loop = true;
bgm.playbackRate = 1;

let splat = new Tone.Player("assets/splat.mp3").toDestination();
let skitter = new Tone.Player("assets/skitter.mp3").toDestination();
let whiff = new Tone.Player("assets/whiff.mp3").toDestination();

//1 = up, 2 = down, 3 = right, 4 = left
let directions = [1,2,3,4];

function preload()
{
  angleMode(DEGREES);

  let animations = 
    {
      squishedY: {row: 0, col:6, frames: 1},
      walkY: {row: 0, frames: 6},

      squishedX: {row: 1, col:6, frames: 1},
      walkX: {row: 1, frames: 6}
    };

    for(let i=0; i < 10; i++)
      {
        bugs.push (new Bug(random(20,381),random(20,381),18,18,'assets/Bug.png',animations, random(directions),false,false));
      }

}

function setup() 
{
  createCanvas(400, 400);

  startButton = createButton('Press to start');
  startButton.position(35,400);
  startButton.mousePressed(() =>startGame());

  bugs.forEach((bug) => {
    for(let i=0; i<bugs.length; i++)
    {
      bug.sprite.overlaps(bugs[i].sprite)
    }
  })
}

function draw() 
{
  background(100, 200, 140);
  if(startScreen === false)
  {
    bugs.forEach((bug) => {
      bug.turn();
    })

    if (gameOver === true)
    {
      gameEnd();
    }
    
    else
    {
      playing();
    }
  }
}

function mousePressed()
{
  bugs.forEach((bug) => {
    if(bug.onBug === true)
    {
      bug.die();
    }
    else
    {
      whiff.start();
    }
  })
}

function startGame()
{
  if(startScreen === true)
  {
    bugs.forEach((bug) => {
      bug.startWalk();
    })
    bgm.start();
    startScreen = false;
  }
}

function playing()
{
  textSize(10);
  text("Bugs squished: " + (score-1),20,20);
  text("Time remaining: " + ceil(timeRemaining),20,40);

  timeRemaining -= deltaTime/1000;
  if(timeRemaining < 0)
  {
    bgm.loop = false;
    gameOver = true;
  }

  bugs.forEach((bug) => {
      if(mouseX > bug.sprite.x - 9 && mouseX < bug.sprite.x + 9 && mouseY > bug.sprite.y - 9 && mouseY < bug.sprite.y + 9)
      {
        bug.onBug = true;
      }

      else
      {
        bug.onBug = false;
      }
  })
}

function gameEnd()
{
  textSize(15);
  text("GAME OVER",140,125);
  text("SCORE: " + (score-1),148,150);
}

class Bug 
{
  constructor(x,y,width,height,spriteSheet,animations,direction,isDead,onBug) 
  {
    this.sprite = new Sprite(x,y,width,height);
    this.sprite.spriteSheet = spriteSheet;
    
    this.sprite.anis.frameDelay = 8;
    this.sprite.addAnis(animations);

    this.direction = direction;
    this.isDead = isDead;
    this.onBug = onBug;
  }

  die()
  {
    if(this.isDead === false)
    {
      this.sprite.vel.x = 0;
      this.sprite.vel.y = 0;
  
      if(this.direction === 1 || this.direction === 2)
      {
        this.sprite.changeAni('squishedY');
      }
    
      else if(this.direction === 3 || this.direction === 4)
      {
        this.sprite.changeAni('squishedX');
      }

      score += 1;
      this.isDead = true;
      bgm.playbackRate += .008;
      splat.start();
    }
  }

  startWalk()
  {
    if(this.direction === 1 || this.direction === 2)
    {
      this.sprite.changeAni('walkY');
    }

    else if(this.direction === 3 || this.direction === 4)
    {
      this.sprite.changeAni('walkX');
    }

    if(this.direction === 1)
    {
      this.sprite.vel.y = -score*1.1;
    }

    else if(this.direction === 2)
    {
      this.sprite.scale.y = -1;
      this.sprite.vel.y = score*1.1;
    }

    else if(this.direction === 3)
    {
      this.sprite.vel.x = score*1.1;
    }

    else if(this.direction === 4)
    {
      this.sprite.scale.x = -1;
      this.sprite.vel.x = -score*1.1;
    }
  }

  turn()
  {
    if(this.isDead === false)  
    {
        if(this.sprite.x > width - 5)
      {
        this.sprite.vel.x = -score*1.1;
        this.sprite.scale.x = -1;
        skitter.start();
      }

      else if(this.sprite.x < 5)
      {
        this.sprite.vel.x = score*1.1;
        this.sprite.scale.x = 1;
        skitter.start();
      }

      else if(this.sprite.y < 5)
      {
        this.sprite.vel.y = score*1.1;
        this.sprite.scale.y = -1;
        skitter.start();
      }

      else if(this.sprite.y > height - 5)
      {
        this.sprite.vel.y = -score*1.1;
        this.sprite.scale.y = 1;
        skitter.start();
      }
    }
  }
}
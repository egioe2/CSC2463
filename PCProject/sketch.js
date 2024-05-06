let sprite;
let bugs = [];
let score = 1;
let timeRemaining = 30;
let gameOver = false;
let startScreen = true;
let startButton;

let port;
let joyX = 0; 
let joyY = 0;
let sw = 0;
let connectButton;
let circleX = 0;
let circleY = 0;
let speed = 2;

let bgm = new Tone.Player("assets/BGM.mp3").toDestination();
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
  port = createSerial();
  createCanvas(400, 400);
  circleX = width/2;
  circleY = height/2;

  connectButton = createButton("Connect");
  connectButton.position(35,420);
  connectButton.mousePressed(connect);

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0],9600);
  }

  startButton = createButton('Press to start');
  startButton.position(35,400);
  startButton.mousePressed(() => {
    if(startScreen === true)
    {
      bgm.loop = true,
      bgm.start(),
      bugs.forEach((bug) => {
        bug.startWalk();
      }),
      startScreen = false;
    }
  });

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

  let str = port.readUntil("\n");
  let values = str.split(",");
  if (values.length > 2) {
    joyX = values[0];
    joyY = values[1];
    sw = Number(values[2]);

    if(joyX > 0)
    {
      circleX += speed;
    }
    else if(joyX < 0)
    {
      circleX -= speed;
    }

    if(joyY > 0)
    {
      circleY += speed;
    }
    else if(joyY < 0)
    {
      circleY -= speed;
    }

  }

  circle(circleX, circleY, 5);

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
      if(circleX > bug.sprite.x - 9 && circleX < bug.sprite.x + 9 && circleY > bug.sprite.y - 9 && circleY < bug.sprite.y + 9)
      {
        bug.onBug = true;
      }

      else
      {
        bug.onBug = false;
      }

      if(bug.onBug === true)
      {
      bug.die();
      }
  })
}

function gameEnd()
{
  textSize(15);
  text("GAME OVER",140,125);
  text("SCORE: " + (score-1),148,150);
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
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

      if (port.opened) 
      {
        let pixel = get(0,0);
        let message = `${pixel[0]} ${pixel[1]} ${pixel[2]}\n}`;
        port.write(message);

        message = `${0} ${0} ${0}\n}`
        port.write(message);
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
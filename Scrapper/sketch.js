let pSprite;
let shipSprite;
let lasers = [];
let robots = [];
let score = .1;
//directions: 1=up 2=down 3=right 4=left
let direction = 2;
let elapsedTime = 0;
let scrapLevel = 1;
let scrap = 190;
let rob;
let addRob = false;
let currRob = 0;
let timer = 300;
let shootLas = false;
let lasAnims;
let elapsedTime2 = 0;
let gameOver = false;
let startScreen = true;
let robAnims;
let rDirection;
let gameWin = false;
let message;

let noise = new Tone.Noise("white"); 
let filter = new Tone.Filter (2000, "lowpass"); 
noise.connect(filter);
filter.toDestination();
let pew = new Tone.Player("assets/shot.mp3").toDestination();
let sequence, sequence2, saw, square;
let melody = [["A1", "A2"],["A3"],["E4"],["E4","G3"]];
saw = new Tone.Synth({
  oscillator: {
    type: "sawtooth"
  }
}).toDestination();
sequence = new Tone.Sequence(function(time,note){
  saw.triggerAttackRelease(note,0.5);
}, melody, "4n");
Tone.Transport.start();
Tone.Transport.bpm.value = 100;

let port;
let joyX = 0; 
let joyY = 0;
let sw = 0;
let connectButton;

function preload()
{
  rob = loadImage('assets/Robot.png');
  las = loadImage('assets/Laser.png');

  pSprite = new Sprite(225,200,32,32);
  pSprite.spriteSheet = 'assets/Pilot.png';
  let pilotAnims = 
    {
      faceDown: {row: 0, frames: 1},
      faceRight: {row: 2, frames: 1},
      faceUp: {row: 1, frames: 1},
      faceLeft: {row: 3, frames: 1}
    };
    pSprite.addAnis(pilotAnims);
    pSprite.changeAni('faceDown');

  shipSprite = new Sprite(200,190,32,32);
  shipSprite.spriteSheet = 'assets/Ship.png';
  let shipAnims = 
    {
      destroyed: {row: 0, frames: 1},
      stage1: {row: 1, frames: 1},
      stage2: {row: 2, frames: 1},
      stage3: {row: 3, frames: 1},
      stage4: {row: 4, frames: 1}
    };
    shipSprite.addAnis(shipAnims);
    shipSprite.changeAni('stage4'); 
}

function setup()
{
  port = createSerial();

  connectButton = createButton("Connect");
  connectButton.position(35,420);
  connectButton.mousePressed(connect);

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0],9600);
  }

  robAnims = 
    {
      rob1: {col: 0, frames: 2}
    };
  lasAnims = 
    {
      laser: {row: 0, frames: 1}
    }; 

  shipSprite.overlaps(pSprite);
  createCanvas(400,400);

  titleScreen();
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}

function draw()
{
  let str = port.readUntil("\n");
  let values = str.split(",");
  if (values.length > 2) {
    joyX = values[0];
    joyY = values[1];
    sw = Number(values[2]);

    if(joyX > 0)
      {
        direction = 3;
        pSprite.changeAni('faceRight');
      }
    else if(joyX < 0)
      {
        direction = 4;
        pSprite.changeAni('faceLeft');
      }
    
    else if(joyY > 0)
      {
        direction = 1;
        pSprite.changeAni('faceUp');
      }
    else if(joyY < 0)
      {
        direction = 2;
        pSprite.changeAni('faceDown');
      }
  }

  if(sw === 1 && startScreen === true)
    {
      Tone.start();
      sequence.start();
      startScreen = false; 
    }

  if(gameOver === false && startScreen === false && gameWin === false)
  {
    background(70, 70, 100);
    playing();
  }
  else if(gameOver === true)
  {
    sequence.stop();
    background(70, 70, 100);
    textSize(15);
    text("GAME OVER",140,135);

    elapsedTime = 0;
    scrapLevel = 1;
    scrap = 100;
    addRob = false;
    currRob = 0;
    timer = 300;
    shootLas = false;
    elapsedTime2 = 0;

    if(sw === 1)
    {
      if(startScreen === false && gameOver === true)
      {
        if (port.opened) 
        {
          port.write(`${5} ${0}`);
          port.write(`${6} ${0}`);
          port.write(`${9} ${0}`);
          port.write(`${10} ${0}`);
          port.write(`${11} ${0}`);
        }

        robots.forEach((robot) => {
          robot.sprite.remove();
        })
        background(255, 255, 255);
        startScreen = true;
        gameOver = false;
        titleScreen();
      }
    }
  }
  else if(gameWin === true)
    {
      sequence.stop();
      background(70, 70, 100);
      textSize(25);
      text("You Win!",140,135);
  
      elapsedTime = 0;
      scrapLevel = 1;
      scrap = 100;
      addRob = false;
      currRob = 0;
      timer = 300;
      shootLas = false;
      elapsedTime2 = 0;
  
      if(sw === 1)
      {
        if(startScreen === false && gameWin === true)
        {
          if (port.opened) 
            {
              port.write(`${5} ${0}`);
              port.write(`${6} ${0}`);
              port.write(`${9} ${0}`);
              port.write(`${10} ${0}`);
              port.write(`${11} ${0}`);
            }
          robots.forEach((robot) => {
            robot.sprite.remove();
          })
          background(255, 255, 255);
          startScreen = true;
          gameWin = false;
          titleScreen();
        }
      }
    }
  
}

function titleScreen()
{
  textSize(15);
  text("Scrapper",140,140);
}

function playing()
{
  textSize(10);
  elapsedTime += deltaTime/1000;
  elapsedTime2 += deltaTime/1000;

  if(timer > 0)
  {
    timer -= deltaTime/1000;
  }
  else if(timer <= 0)
  {
    gameOver = true;
  }
  text('Time Remaining: ' + ceil(timer), 0, 10);
  text('Scrap: ' + scrap, 0, 20);

  if(ceil(elapsedTime) % (-scrapLevel + 7) === 0)
  {
    addRob = true;
    elapsedTime = 0;
  }
  if(ceil(elapsedTime2) % (-scrapLevel + 6) === 0)
  {
    {
      shootLas = true;
      elapsedTime2 = 0;
    }
  }

  while(addRob === true)
  {
    robots.push(new Robot(random([200,-20,420]),32,32,rob,robAnims));
    robots.forEach((robot) => {
      robot.sprite.overlaps(shipSprite);
      robot.sprite.overlaps(pSprite);
      for(let i=0; i<robots.length; i++)
      {
        robot.sprite.overlaps(robots[i].sprite);
        for(let j=0; j<lasers.length; j++)
        {
          robots[i].sprite.overlaps(lasers[j].sprite);
        }
      }
    })
    robots[currRob].walk();
    currRob = currRob+1;
    addRob = false;
  }

  while(shootLas === true)
  {
    lasers.push(new Laser(195.25,184,18,18,las,lasAnims));
    pew.start();
    lasers.forEach((laser) => {
      laser.sprite.overlaps(shipSprite);
      laser.sprite.overlaps(pSprite);
      for(let i=0; i<lasers.length; i++)
      {
        laser.sprite.overlaps(lasers[i].sprite);
        for(let j=0; j<robots.length; j++)
        {
          lasers[i].sprite.overlaps(robots[j].sprite);
        }
      }
    })

    if(direction === 1)
    {
      lasers[lasers.length-1].sprite.vel.y = -1*(scrapLevel - .5);
    }
    else if(direction === 2)
    {
      lasers[lasers.length-1].sprite.vel.y = 1*(scrapLevel - .5);
    }
    else if(direction === 3)
    {
      lasers[lasers.length-1].sprite.vel.x = 1*(scrapLevel - .5);
    }
    else if(direction === 4)
    {
      lasers[lasers.length-1].sprite.vel.x = -1*(scrapLevel - .5);
    }

    shootLas = false;
  }

  robots.forEach((robot) => {
    if(robot.sprite.overlaps(shipSprite))
    {
      noise.start();
      filter.frequency.rampTo(100,1);
      noise.onstop(filter.frequency.value = 2000);
      noise.stop("+.4");
      scrap -= 20;
      robot.sprite.remove();
    }
    lasers.forEach((laser) => {
      if(robot.sprite.overlaps(laser.sprite))
      {
        noise.start();
        filter.frequency.rampTo(100,1);
        noise.onstop(filter.frequency.value = 2000);
        noise.stop("+.4");
        scrap += 10;
        score += .05;
        robot.sprite.remove();
        laser.sprite.remove();
      }
      if(laser.sprite.x > 380 || laser.sprite.x < 20 || laser.sprite.y > 380 || laser.sprite.y < 20)
      {
        laser.sprite.remove();
      }
    })
  })

  if(scrap <= 0)
  {
    if (port.opened) 
      {
        port.write(`${5} ${0}`);
      }
    scrapLevel = 0;
    shipSprite.changeAni('destroyed');
    robots.forEach((robot) => {
      robot.sprite.vel.x = 0;
      robot.sprite.vel.y = 0;
    })
    lasers.forEach((laser) => {
      laser.sprite.vel.x = 0;
      laser.sprite.vel.y = 0;
      laser.sprite.remove();        
      
    })
    gameOver = true;
  }
  else if(scrap > 0 && scrap < 200)
  {
    if (port.opened) 
    {
      port.write(`${5} ${100}`);
      port.write(`${6} ${0}`);
    }
    scrapLevel = 1;
    shipSprite.changeAni('stage1');
  }
  else if(scrap >= 200 && scrap < 300)
  {
    if (port.opened) 
      {
        port.write(`${6} ${100}`);
        port.write(`${9} ${0}`);
      }
    scrapLevel = 2;
    shipSprite.changeAni('stage2');
  }
  else if(scrap >= 300 && scrap < 400)
  {
    if (port.opened) 
      {
        port.write(`${9} ${100}`);
        port.write(`${10} ${0}`);
      }
    scrapLevel = 3;
    shipSprite.changeAni('stage3');
  }
  else if(scrap >= 400 && scrap < 500)
  {
    if (port.opened) 
      {
        port.write(`${10} ${100}`);
        port.write(`${11} ${0}`);
      }
    scrapLevel = 4;
    shipSprite.changeAni('stage4');
  }
  else if(scrap >= 500)
  {
    if (port.opened) 
      {
        port.write(`${11} ${100}`);
      }
    scrapLevel = 5;
    robots.forEach((robot) => {
      robot.sprite.vel.x = 0;
      robot.sprite.vel.y = 0;
    })
    lasers.forEach((laser) => {
      laser.sprite.vel.x = 0;
      laser.sprite.vel.y = 0;
      laser.sprite.remove();        
      
    })
    gameWin = true;
  }
}

class Laser 
{
  constructor(x,y,width,height,spriteSheet,animations,direction) 
  {
    this.sprite = new Sprite(x,y,width,height);
    this.sprite.spriteSheet = spriteSheet;
    
    this.sprite.anis.frameDelay = 8;
    this.sprite.addAnis(animations);

    this.direction = direction;
  }
}

class Robot 
{
  constructor(x,width,height,spriteSheet,animations) 
  {
    rDirection = 0;
    let y;

    if(x === 200)
    {
      y = random([-20,420]);
      this.sprite = new Sprite(x,y,width,height);
    }
    else
    {
      y = 200;
      this.sprite = new Sprite(x,y,width,height);
    }

    if(this.sprite.y === -20)
    {
      this.rDirection = 1;
    }

    else if(this.sprite.y === 420)
    {
      this.rDirection = 2;
    }

    else if(this.sprite.x === -20)
    {
      this.rDirection = 4;
    }

    else if(this.sprite.x === 420)
    {
      this.rDirection = 3;
    }

    this.sprite.spriteSheet = spriteSheet;
    
    this.sprite.anis.frameDelay = 20;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('rob1');
  }

  walk()
  {
    if(this.rDirection === 1)
    {
      this.sprite.vel.y = score;
    }

    else if(this.rDirection === 2)
    {
      this.sprite.vel.y = -score;
    }

    else if(this.rDirection === 3)
    {
      this.sprite.vel.x = -score;
    }

    else if(this.rDirection === 4)
    {
      this.sprite.vel.x = score;
    }   
  }
}

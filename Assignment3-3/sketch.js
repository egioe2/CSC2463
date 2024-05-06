let port;
let joyX = 0; 
let joyY = 0;
let sw = 0;
let connectButton;
let circleX = 0;
let circleY = 0;

function setup() {
  port = createSerial();
  createCanvas(400, 400);

  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0],9600);
  }
}

function draw() {

  background(0,joyY,joyX);

  let str = port.readUntil("\n");
  let values = str.split(",");
  if (values.length > 2) {
    joyX = values[0];
    joyY = values[1];
    sw = Number(values[2]);
  }
}

function mousePressed() {
  x = mouseX;
  y = mouseY;

  if (port.opened) {
    let pixel = get(x,y);
    let message = `${pixel[0]} ${pixel[1]} ${pixel[2]}\n}`;
    port.write(message);
  }
}


function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}

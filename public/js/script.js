// the client

// const CONNECTION_NAME = "connection_name";
let socket;
// let thisId = prompt("ID?");
// console.log(thisId); // browser


let screenWidth = window.screen.width;
let screenHeight = window.screen.height;
var windowX;
var windowY;
const screenBar = 25; // needs improvement
const windowBar = 57; // needs improvement
let xOff;
let yOff;
// console.log("window", window.innerWidth, window.innerHeight);


// window initial settings
let properties = ["is_bouncing_pad", "is_force", "is_black_hole"];
let property;
let bouncing_pads = ["left", "right", "top", "bottom"];
let bouncing_pad;
let forces = ["gravity", "anti_gravity", "left_push", "right_push"];
let force;


let r, g, b;
let bg_color = 220;
let c = 255;


let ball;
let balls = [];
let particles = [];
let drops = [];
let updrops = [];

let goalX;
let goalY;

let splitit = false;
let just_travelled = false;

let beat;
let huhu;
let teleport;

function preload() {
  beat = loadSound("assets/beat.mp3");
  huhu = loadSound("assets/huhu.wav");
  teleport = loadSound("assets/teleport.wav");

}



function setup() {
  let cnv = createCanvas(400, 400);
  cnv.id("p5-canvas");
  background(bg_color);


  // window initial settings
  property = properties[Math.floor(Math.random() * properties.length)];
  // property = "is_gravity";
  // property = "is_bouncing_pad";
  if (property == "is_bouncing_pad") {
    bouncing_pad = bouncing_pads[Math.floor(Math.random() * bouncing_pads.length)];
  } else if (property == "is_force") {
    force = forces[Math.floor(Math.random() * forces.length)];
  }
  goalX = Math.floor(Math.random() * screenWidth);
  goalY = Math.floor(Math.random() * screenHeight);


  // integrate window settings
  let settings = {
    windowX: windowX,
    windowY: windowY,
    property: property
  };


  ball = new Ball(50, 200, 0, 0, 30);
  // balls.push(new Ball(0, 200, 1, 1, 30));


  /*******
   Connect to the WebSocket server using the io.connect() method provided by the socket.io library, 
   and assign the resulting socket object to the socket variable.
   ********/
  socket = io.connect();
  console.log("socket:", socket);
  // console.log("say sth");
  // socket.emit("clientOutWindow", settings); // send out the window settings for once
  socket.on("serverOutBall", receiveBallInfo); // set up a listener that waits for the event: "serverOutBall"
  // socket.on("newcomerAskForBall", sendBallInfo); //
  socket.on("serverOutGoal", resetGoalPos);
}

function draw() {
  // socket.on("newcomerAskForBall", sendBallInfo);
  background(bg_color);
  fill(c);

  windowX = window.screenX;
  windowY = window.screenY;
  xOff = windowX;
  yOff = windowY + windowBar;

  drawBackground();

  drawGoal(goalX, goalY);

  push();
  translate(-windowX, -windowY - windowBar); // align the origin
  stroke(0);
  circle(ball.x, ball.y, ball.dia); // relative pos
  pop();

  ball.move();
  // ball.split();
  if (property == "is_bouncing_pad") {
    ball.bounce();
  } else if (property == "is_black_hole") {
    ball.blackhole();
  } else if (property == "is_force") {
    ball.force();
  }

  checkIfReached();

}

class Ball {
  constructor(x, y, xSpd, ySpd, dia) {
    this.ballid = balls.length + 1  //
    this.x = x;
    this.y = y;
    this.xSpd = xSpd;
    this.ySpd = ySpd;
    this.dia = dia;
    this.restoreXSpd = this.xSpd;
    this.restoreYSpd = this.ySpd;
    this.restored = true;
    this.xAcc = 0;
    this.yAcc = 0;
    this.grownUp = false;
  }

  move() {
    //update pos
    this.x += this.xSpd;
    this.y += this.ySpd;
    // this.xSpd += this.xAcc;
    // this.ySpd += this.yAcc;
    this.xSpd *= 0.99;
    this.ySpd *= 0.99;
    console.log("spd", this.xSpd, this.ySpd);
    if (this.y > screenHeight - this.dia / 2) {
      this.ySpd *= -1;
      sendBallInfo();
    } else if (this.y < 0 + this.dia / 2 + windowBar) {
      this.ySpd *= -1;
      sendBallInfo();
    } else if (this.x > screenWidth - this.dia / 2) {
      this.xSpd *= -1;
      sendBallInfo();
    } else if (this.x < 0 + this.dia / 2) {
      this.xSpd *= -1;
      sendBallInfo();
    }
  }

  isInsideWindow() {
    if (this.x < windowX + window.innerWidth + 1 && this.x > windowX + 0 - 1
      && this.y < windowY + windowBar + window.innerHeight + 1 && this.y > windowY + windowBar - 1) {
      return true;
    } else {
      return false;
    }
  }

  bounce() {
    fill(255, 217, 90, 50);
    if (bouncing_pad == "bottom") {
      push();
      translate(-windowX, -windowY - windowBar);
      rect(windowX, windowY + windowBar + window.innerHeight - 15, window.innerWidth, 15);
      pop();
      if (this.isInsideWindow() == true) {
        if (this.y > windowY + windowBar + window.innerHeight - 15 - this.dia / 2) {
          this.y = windowY + windowBar + window.innerHeight - 15 - this.dia / 2;
          this.ySpd *= -1;
          beat.play();
          sendBallInfo();
        }
      }
    } else if (bouncing_pad == "top") {
      push();
      translate(-windowX, -windowY - windowBar);
      rect(windowX, windowY + windowBar, window.innerWidth, 15);
      pop();
      if (this.isInsideWindow() == true) {
        if (this.y < windowY + windowBar + 15 + this.dia / 2) {
          this.y = windowY + windowBar + 15 + this.dia / 2;
          this.ySpd *= -1;
          beat.play();
          sendBallInfo();
        }
      }
    } else if (bouncing_pad == "left") {
      push();
      translate(-windowX, -windowY - windowBar);
      rect(windowX + window.innerWidth - 15, windowY + windowBar, 15, window.innerHeight);
      pop();
      if (this.isInsideWindow() == true) {
        if (this.x > windowX + window.innerWidth - 15 - this.dia / 2) {
          this.x = windowX + window.innerWidth - 15 - this.dia / 2;
          this.xSpd *= -1;
          beat.play();
          sendBallInfo();
        }
      }
    } else if (bouncing_pad == "right") {
      push();
      translate(-windowX, -windowY - windowBar);
      rect(windowX, windowY + windowBar, 15, window.innerHeight);
      pop();
      if (this.isInsideWindow() == true) {
        if (this.x < windowX + 0 + 15 + this.dia / 2) {
          this.x = windowX + 0 + 15 + this.dia / 2;
          this.xSpd *= -1;
          beat.play();
          sendBallInfo();
        }
      }
    }
  }

  blackhole() {
    let centerX = windowX + window.innerWidth / 2; // absolute pos
    let centerY = windowY + windowBar + window.innerHeight / 2;
    push();
    translate(-windowX, -windowY - windowBar);
    stroke(88, 0, 255);
    angleMode(RADIANS);
    for (let i = 0; i < 360; i += 15) {
      let x = centerX + 30 * cos(radians(i));
      let y = centerY + 20 * sin(radians(i));
      let x2 = centerX + 60 * cos(radians(i));
      let y2 = centerY + 23 * sin(radians(i));
      let size = map(sin(frameCount / 15 + i * 3), -1, 1, 5, 10);
      fill(0, 255, 202, 150);
      ellipse(x, y, size, size);
      fill(0, 255, 202, 50);
      ellipse(x2, y2, size, size);
    }
    pop();
    if (this.x < centerX + 25 && this.x > centerX - 25
      && this.y < centerY + 15 && this.y > centerY - 15) {
      this.xSpd *= 9 / 10;
      this.ySpd *= 9 / 10;
      this.dia -= 3;
      if (this.dia < 15) {
        this.x = random(0, screenWidth);
        this.y = random(0, screenHeight);
        this.xSpd = random(-2, 2);
        this.ySpd = random(-2, 2);
        this.storeX = this.x;
        this.storeY = this.y;
        this.dia = 30;
        just_travelled = true;
        sendBallInfo();
        teleport.play();
      }
    }
    // let frame = 0;
    if (just_travelled == true) {
      stroke(255);
      fill(0, 255, 202);
      particles.push(new Particle(this.storeX, this.storeY, random(-2, 2), random(-2, 2), 12));
      for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        particle.show();
        particle.move();
        particle.shrink();
      }
      if (particles.length > 30) {
        particles.splice(0, 1);
      }
      // frame++;
      // console.log(frame);
      // if (frame > 1000) {
      //   just_travelled = false;
      // }
    }
  }

  force() {
    if (force == "gravity") {
      if (this.isInsideWindow() == true) {
        // this.dia += 0.02;
        this.ySpd += 1.5;
        sendBallInfo();
        if (huhu.isPlaying() == false) {
          huhu.loop();
        }
      } else {
        huhu.pause();
      }
      if (frameCount % 5 == 0) {
        drops.push(new Drop(random(windowX, windowX + window.innerWidth), windowY));
      }
      for (let i = 0; i < drops.length; i++) {
        drops[i].fall();
        drops[i].showVertical();
      }
      if (drops.length > 20) {
        drops.splice(0, 1);
      }
    } else if (force == "anti_gravity") {
      if (this.isInsideWindow() == true) {
        // this.dia -= 0.02;
        this.ySpd -= 1.5;
        sendBallInfo();
        if (huhu.isPlaying() == false) {
          huhu.loop();
        }
      } else {
        huhu.pause();
      }
      if (frameCount % 5 == 0) {
        updrops.push(new Drop(random(windowX, windowX + window.innerWidth), windowY + windowBar + window.innerHeight));
      }
      for (let i = 0; i < updrops.length; i++) {
        updrops[i].rise();
        updrops[i].showVertical();
      }
      if (updrops.length > 20) {
        updrops.splice(0, 1);
      }
    } else if (force == "right_push") {
      if (this.isInsideWindow() == true) {
        // this.dia -= 0.02;
        this.xSpd += 1.5;
        sendBallInfo();
        if (huhu.isPlaying() == false) {
          huhu.loop();
        }
      } else {
        huhu.pause();
      }
      if (frameCount % 5 == 0) {
        updrops.push(new Drop(windowX - 20, random(windowY + windowBar, windowY + windowBar + window.innerHeight)));
      }
      for (let i = 0; i < updrops.length; i++) {
        updrops[i].rightPush();
        updrops[i].showHorizontal();
      }
      if (updrops.length > 20) {
        updrops.splice(0, 1);
      }
    } else if (force == "left_push") {
      if (this.isInsideWindow() == true) {
        // this.dia -= 0.02;
        this.xSpd -= 1.5;
        sendBallInfo();
        if (huhu.isPlaying() == false) {
          huhu.loop();
        }
      } else {
        huhu.pause();
      }
      if (frameCount % 5 == 0) {
        updrops.push(new Drop(windowX + window.innerWidth, random(windowY + windowBar, windowY + windowBar + window.innerHeight)));
      }
      for (let i = 0; i < updrops.length; i++) {
        updrops[i].leftPush();
        updrops[i].showHorizontal();
      }
      if (updrops.length > 20) {
        updrops.splice(0, 1);
      }
    }

  }

}



function refresh() {
  if (property == "is_bouncing_pad") {
    bouncing_pad = bouncing_pads[Math.floor(Math.random() * bouncing_pads.length)];
  }
}


function mousePressed() {


  if (splitit == true) {
    balls.splice(0, 1);
    for (let i = 0; i < 5; i++) {
      balls.push(new Ball(mouseX + xOff, mouseY + yOff, random(-2, 2), random(-2, 2), 20)); // absolute value
    }
    splitit = false;
  }
  bg_color = 0;
  fill(0);
}

function sendWindowInfo() {

}

function sendBallInfo() {
  console.log("sent");
  let data = {
    x: ball.x,
    y: ball.y,
    xSpd: ball.xSpd,
    ySpd: ball.ySpd,
    dia: ball.dia,
    xAcc: ball.xAcc,
    yAcc: ball.yAcc
  };
  socket.emit("clientOutBall", data);
}


function receiveBallInfo(data) {
  console.log("got");
  ball.x = data.x;
  ball.y = data.y;
  ball.xSpd = data.xSpd;
  ball.ySpd = data.ySpd;
  ball.dia = data.dia;
  ball.xAcc = data.xAcc;
  ball.yAcc = data.yAcc;
}


function resetGoalPos(goalData) {
  goalX = goalData.gX;
  goalY = goalData.gY;
}



window.addEventListener("resize", resize);
function resize() {
  let p5canvas = document.getElementById("p5-canvas");
  resizeCanvas(windowWidth, windowHeight);
}



function checkIfReached() {
  if (ball.x > goalX - 15 && ball.x < goalX + 15
    && ball.y > goalY - 15 && ball.y < goalY + 15) {
    goalX = Math.floor(Math.random() * screenWidth);
    goalY = Math.floor(Math.random() * screenHeight);
    console.log("reached!!");
  }
}


function drawGoal(x, y) {
  console.log("goal", x, y);
  console.log("screen", screenWidth, screenHeight);
  push();
  translate(-windowX, -windowY - windowBar);
  stroke(255, 200, 0);
  strokeWeight(2);
  fill(255, 200, 0, 50);
  const gX = x;
  const gY = y;
  const radius = 30;
  const npoints = 5;
  const angle = 360 / npoints;
  const halfAngle = angle / 2;
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    const sx = gX + cos(a) * radius;
    const sy = gY + sin(a) * radius;
    vertex(sx, sy);
    const tx = gX + cos(a + halfAngle) * radius / 2.5;
    const ty = gY + sin(a + halfAngle) * radius / 2.5;
    vertex(tx, ty);
  }
  endShape(CLOSE);
  pop();

}



function drawBackground() {
  // absolute value
  push();
  translate(-windowX, -windowY - windowBar);
  bg_color = color(202, 240, 248);
  stroke(255);
  strokeWeight(0.5);
  angleMode(DEGREES);
  translate(screenWidth / 2, screenHeight / 2);
  let distance = 5;


  for (let i = 0; i < 150; i++) {

    for (let j = 0; j < 360; j += 29.7) {
      let r = map(i, 0, 50, 0, 202);
      let g = map(i, 0, 50, 120, 240);
      let b = map(i, 0, 50, 216, 248);
      R = map(i, 60, 0, 0, 202);
      G = map(i, 60, 0, 180, 240);
      B = map(i, 60, 0, 216, 248);
      rotate(j);
      fill(r, g, b, 180);
      stroke(R, G, B);
      rect(0, i * 5.5, 30 + i, 30 + i);

    }
  }
  pop();
}





/* global
io, p5, ADD, ALT, ARROW, AUDIO, AUTO, AXES, BACKSPACE, BASELINE, BEVEL, BEZIER, BLEND, BLUR, BOLD, BOLDITALIC, BOTTOM, BURN, CENTER, CHORD, CLAMP, CLOSE, CONTROL, CORNER, CORNERS, CROSS, CURVE, DARKEST, DEGREES, DEG_TO_RAD, DELETE, DIFFERENCE, DILATE, DODGE, DOWN_ARROW, ENTER, ERODE, ESCAPE, EXCLUSION, FALLBACK, FILL, GRAY, GRID, HALF_PI, HAND, HARD_LIGHT, HSB, HSL, IMAGE, IMMEDIATE, INVERT, ITALIC, LABEL, LANDSCAPE, LEFT, LEFT_ARROW, LIGHTEST, LINEAR, LINES, LINE_LOOP, LINE_STRIP, MIRROR, MITER, MOVE, MULTIPLY, NEAREST, NORMAL, OPAQUE, OPEN, OPTION, OVERLAY, P2D, PI, PIE, POINTS, PORTRAIT, POSTERIZE, PROJECT, QUADRATIC, QUADS, QUAD_STRIP, QUARTER_PI, RADIANS, RADIUS, RAD_TO_DEG, REMOVE, REPEAT, REPLACE, RETURN, RGB, RIGHT, RIGHT_ARROW, ROUND, SCREEN, SHIFT, SOFT_LIGHT, SQUARE, STROKE, SUBTRACT, TAB, TAU, TESS, TEXT, TEXTURE, THRESHOLD, TOP, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, TWO_PI, UP_ARROW, VIDEO, WAIT, WEBGL, accelerationX, accelerationY, accelerationZ, deltaTime, deviceOrientation, displayHeight, displayWidth, focused, frameCount, height, isKeyPressed, key, keyCode, keyIsPressed, mouseButton, mouseIsPressed, mouseX, mouseY, movedX, movedY, pAccelerationX, pAccelerationY, pAccelerationZ, pRotateDirectionX, pRotateDirectionY, pRotateDirectionZ, pRotationX, pRotationY, pRotationZ, pixels, pmouseX, pmouseY, pwinMouseX, pwinMouseY, rotationX, rotationY, rotationZ, touches, turnAxis, width, winMouseX, winMouseY, windowHeight, windowWidth, abs, acos, alpha, ambientLight, ambientMaterial, angleMode, append, applyMatrix, arc, arrayCopy, asin, atan, atan2, background, beginContour, beginShape, bezier, bezierDetail, bezierPoint, bezierTangent, bezierVertex, blend, blendMode, blue, boolean, box, brightness, byte, camera, ceil, char, circle, clear, clearStorage, color, colorMode, concat, cone, constrain, copy, cos, createA, createAudio, createButton, createCamera, createCanvas, createCapture, createCheckbox, createColorPicker, createDiv, createElement, createFileInput, createGraphics, createImage, createImg, createInput, createNumberDict, createP, createRadio, createSelect, createShader, createSlider, createSpan, createStringDict, createVector, createVideo, createWriter, cursor, curve, curveDetail, curvePoint, curveTangent, curveTightness, curveVertex, cylinder, day, debugMode, degrees, describe, describeElement, directionalLight, displayDensity, dist, downloadFile, ellipse, ellipseMode, ellipsoid, emissiveMaterial, endContour, endShape, erase, exitPointerLock, exp, fill, filter, float, floor, fract, frameRate, frustum, fullscreen, get, getFrameRate, getItem, getURL, getURLParams, getURLPath, green, gridOutput, hex, hour, httpDo, httpGet, httpPost, hue, image, imageMode, int, isLooping, join, keyIsDown, lerp, lerpColor, lightFalloff, lightness, lights, line, loadBytes, loadFont, loadImage, loadJSON, loadModel, loadPixels, loadShader, loadStrings, loadTable, loadXML, log, loop, mag, map, match, matchAll, max, millis, min, minute, model, month, nf, nfc, nfp, nfs, noCanvas, noCursor, noDebugMode, noErase, noFill, noLights, noLoop, noSmooth, noStroke, noTint, noise, noiseDetail, noiseSeed, norm, normal, normalMaterial, orbitControl, ortho, perspective, pixelDensity, plane, point, pointLight, pop, popMatrix, popStyle, pow, print, push, pushMatrix, pushStyle, quad, quadraticVertex, radians, random, randomGaussian, randomSeed, rect, rectMode, red, redraw, registerPromisePreload, removeElements, removeItem, requestPointerLock, resetMatrix, resetShader, resizeCanvas, reverse, rotate, rotateX, rotateY, rotateZ, round, saturation, save, saveCanvas, saveFrames, saveGif, saveJSON, saveJSONArray, saveJSONObject, saveStrings, saveTable, scale, second, select, selectAll, set, setAttributes, setCamera, setFrameRate, setMoveThreshold, setShakeThreshold, shader, shearX, shearY, shininess, shorten, shuffle, sin, smooth, sort, specularColor, specularMaterial, sphere, splice, split, splitTokens, spotLight, sq, sqrt, square, storeItem, str, stroke, strokeCap, strokeJoin, strokeWeight, subset, tan, text, textAlign, textAscent, textDescent, textFont, textLeading, textOutput, textSize, textStyle, textWidth, texture, textureMode, textureWrap, tint, torus, translate, triangle, trim, unchar, unhex, updatePixels, vertex, writeFile, year
*/
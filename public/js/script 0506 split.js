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



let r, g, b;
let bg_color = 220;
let c = 255;


// let ball;
let balls = [];



let splitit = false;



function setup() {
  let cnv = createCanvas(400, 400);
  cnv.id("p5-canvas");
  background(bg_color);

  /*******
   Connect to the WebSocket server using the io.connect() method provided by the socket.io library, 
   and assign the resulting socket object to the socket variable.
   ********/
  socket = io.connect();
  console.log("socket:", socket);
  socket.on("serverOutPos", receiveViaSocket); // set up a listener that waits the 


  // ball = new Ball(0, 200, 20);
  balls.push(new Ball(0, 200, 1, 1, 30));

}

function draw() {

  background(bg_color);
  fill(c);

  windowX = window.screenX;
  windowY = window.screenY;
  xOff = windowX;
  yOff = windowY + windowBar;

  drawBackground();

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    push();
    translate(-windowX, -windowY - windowBar); // align the origin
    circle(ball.x, ball.y, ball.dia); // relative pos
    pop();
    ball.move();
    ball.split();
    ball.bounce();

  }
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
    if (this.y > screenHeight) {
      this.x = 0;
      this.y = 200;
    } else if (this.y < 0) {
      this.x = 0;
      this.y = 200;
    }
  }

  bounce() {

    // assume bounce pad at the bottom

    if (this.y > windowY + windowBar + window.innerHeight) {
      this.y = windowY + windowBar + window.innerHeight;
      this.ySpd *= -1;
    }
  }


  // grownUp() {
  //   this.grownUp = true;
  // }


  split() {
    if (mouseX + xOff > this.x - this.dia / 2 && mouseX + xOff < this.x + this.dia / 2
      && mouseY + yOff > this.y - this.dia / 2 && mouseY + yOff < this.y + this.dia / 2) {
      // if (this.grownUp) {
      //   this.dia = 40;
      //   if (this.xSpd != 0 && this.ySpd != 0) {
      //     this.restoreXSpd = this.xSpd;
      //     this.restoreYSpd = this.ySpd;
      //   }
      //   this.restored = false;
      //   this.xSpd = 0;
      //   this.ySpd = 0;
      // }
      this.dia = 40;
      splitit = true;

    } else {
      this.dia = 20;
      // if (this.restored == false) {
      //   this.xSpd = this.restoreXSpd;
      //   this.ySpd = this.restoreYSpd;
      //   this.restored = true;
      // }
    }
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

  let data = {
    // id: thisId,
    screenWidth: screenWidth,
    screenHeight: screenHeight,
    windowX: windowX,
    windowY: windowY,
    x: floor(mouseX),
    y: floor(mouseY)
    // r: parseFloat(r.toFixed(1)),
    // g: parseFloat(g.toFixed(1)),
    // b: parseFloat(b.toFixed(1)),
  };

  sendViaSocket(data);
  bg_color = 0;
  stroke(255, 0, 0);
  fill(0);
  // circle(mouseX, mouseY, 30);
}

function receiveViaSocket(data) {
  console.log("The things are printed in the browser");
  console.log(data);

  circle(data.x, data.y, 15);
}

function sendViaSocket(data) {
  socket.emit("clientOutPos", data); // CONNECTION_NAME i.e."connection_name", type of event
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
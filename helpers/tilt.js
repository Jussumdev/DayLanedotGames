
var v3_angles = new Vector(0, 0, 0);
var v3_angles_lerped = new Vector(0, 0, 0);
var v3_lerpRate;
var gammazero, betazero, lastgammazero, lastbetazero;
var gyroscopeMaxAngleX, gyroscopeMinAngleX, gyroscopeMaxAngleY, gyroscopeMinAngleY;
var gyroscopeSamples;

function assignSettings() {
  // ------------------------------ From vanilla-tilt.js (https://micku7zu.github.io/vanilla-tilt.js/)
  // for Gyroscope sampling
  gammazero = null;
  betazero = null;
  lastgammazero = null;
  lastbetazero = null;

  //this.transitionTimeout = null;
  //this.updateCall = null;
  var event = null;

  gyroscopeMaxAngleX = 25;
  gyroscopeMaxAngleY = 25;

  gyroscopeSamples = 1;

  v3_lerpRate = 0.4;
}

assignSettings()


function handleOrientation(event) {
  // ------------------------------ From vanilla-tilt.js (https://micku7zu.github.io/vanilla-tilt.js/)

  if (event.gamma === null || event.beta === null) {
    return;
  }

  if (gyroscopeSamples > 0) {
    lastgammazero = gammazero;
    lastbetazero = betazero;

    if (gammazero === null) {
      gammazero = event.gamma;
      betazero = event.beta;
    } else {
      gammazero = (event.gamma + lastgammazero) / 2;
      betazero = (event.beta + lastbetazero) / 2;
    }

    gyroscopeSamples -= 1;
  }

  //var totalAngleX = gyroscopeMaxAngleX - gyroscopeMinAngleX;
  //var totalAngleY = gyroscopeMaxAngleY - gyroscopeMinAngleY;

  var gamma = event.gamma - gammazero;
  var beta = event.beta - betazero;

    //Clamp angles and put them in range -1...1
  v3_angles.x = clamp(gamma, -1 * gyroscopeMaxAngleX, gyroscopeMaxAngleX) / gyroscopeMaxAngleX
  v3_angles.y = clamp(beta, -1 * gyroscopeMaxAngleY, gyroscopeMaxAngleY) / gyroscopeMaxAngleY

  //console.log(v3_angles)
}

//Get a vector 3 representing the gyroscope angle of the phone in the x and y positions
function getGyroscopeAngles(inverted = false) {
  return inverted ? v3_angles.negative() : v3_angles;
}

function getGyroscopeAnglesLerped(inverted = false) {
  v3_angles_lerped = Vector.lerp(v3_angles_lerped, v3_angles, v3_lerpRate)
  return inverted ? v3_angles_lerped.negative() : v3_angles_lerped;
}

window.addEventListener("deviceorientation", handleOrientation, true);

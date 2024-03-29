


// Create cross browser requestAnimationFrame method:
window.requestAnimationFrame = window.requestAnimationFrame
 || window.mozRequestAnimationFrame
 || window.webkitRequestAnimationFrame
 || window.msRequestAnimationFrame
 || function(f){setTimeout(f, 1000/60)}

  //Array of all trackie elements, once initialized
var trackies = []
  //Array of Vector positions -0.5...0.5 (amt of screen space)
  //trackies[i] has starting position tr_pos[i] relative to center of screen
var tr_pos = []
  //Array of height amounts in 0...1 (amt of screen space)
  //trackies[i] has height tr_height[i]*100% relative to size of screen
var tr_height = []


function initializeTrackies() {
  var trackies_sub_path = getTrackiesPath();
  var actual_JSON = getTrackiesData().array
  //Create trackies according to the js data structure
  for (var i=0; i<actual_JSON.length; i++) {
    var newEl = document.createElement("img");
    var jsonobj = actual_JSON[i];
    //console.log(jsonobj)

      //Take coordinates from 0...1 to -0.5...0.5
    jsonobj.x -= 0.5
    jsonobj.y -= 0.5

    //Parse and assign the ideal position for the element
    //Use normalized x, y to get appropriate offset for the element
    tr_pos[i] = new Vector(jsonobj.x,
                           jsonobj.y,
                           jsonobj.z)
    tr_height[i] = jsonobj.height

    newEl.id = "trackie";
    newEl.src = "images/trackies/"+trackies_sub_path+"/"+jsonobj.src;
    newEl.style = "z-index:"+jsonobj.z+"px;position: fixed;";

    trackies[i] = newEl

    scaleElement(i)

    document.body.appendChild(newEl)
  }
}

function trackWithMouse(v3_mouseToUse) {
    //Get a vector indicating the direction to shift
  var v3_trackVector = v3_mouseToUse.subtract(getOrigin())
    //Get the clamped magnitude of the vector in 0...1 to indicate how far elements should move
  var magnitude = Math.min(v3_trackVector.length(), getMaxDetectionRadius()) / getMaxDetectionRadius()

  track(v3_trackVector.unit(), magnitude)
}

function trackWithGyroscope(v3_angle) {

  var magnitude = v3_angle.length()

  track(v3_angle.unit(), -magnitude)
}

//Use an x-y angle and a magnitude (0...1) to move all trackie images
function track(v3_angle, magnitude){

    //Move farther if the magnitude is high
  v3_trackVector = v3_angle.multiply(getMaxMovementRadius() * magnitude)

  for (var i=0; i<trackies.length; i++) {
    var el = trackies[i]

      //Get the position that the element should inhabit this frame
    var v3_basePos = getOrigin().add(tr_pos[i].multiply(getFrameSize() * 1.04))

    v3_basePos = v3_basePos.add(v3_trackVector.multiply(tr_pos[i].z))

      //Place element at the target
    setElementPos(el, v3_basePos)
  }

}

function scaleElement(i) {
  setElementHeight(trackies[i], tr_height[i] * getFrameSize())
}

//Exponentially smaller value results in linearly smoother mouse motion
var mouseSmoothing = 0.000001
//Frames per second
var trackFramerate = 60
//Number of bobs per second
var bobrate = 1
//Magnitude of max bob relative to minimum window dimension
var bobmagnitude = 0.01

var thisFrameTime = (new Date()).getTime()
var lastFrameTime = thisFrameTime

window.setInterval(function(){
  thisFrameTime = (new Date()).getTime()
  var dt = thisFrameTime - lastFrameTime
  lastFrameTime = thisFrameTime
  //console.log(dt)

  var frameSmooth = 1 - Math.pow(mouseSmoothing, dt / 1000)

  if (getAspectRatio() > 1) {
    // console.log("mouse");
    //Use the mouse position to track
    mouseLerp(frameSmooth)
    mouseBob(bobrate, bobmagnitude)
    trackWithMouse(getMouseBobbed())
  } else {
    //use tilt instead
    // console.log("gyro2");
    trackWithGyroscope(getGyroscopeAnglesLerped(true))
  }

}, 1000 / trackFramerate);

addOnLoad(setDimensions)
addOnLoad(initializeTrackies)

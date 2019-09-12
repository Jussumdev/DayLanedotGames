


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
  var actual_JSON = getTrackiesData().array
  //Create trackies according to the js data structure
  for (var i=0; i<actual_JSON.length; i++) {
    var newEl = document.createElement("img");
    var jsonobj = actual_JSON[i];
    //console.log(jsonobj)

      //Take coordinates from 0...1 to -0.5...0.5
    jsonobj.x -= 0.5
    jsonobj.y -= 0.5

    var frameSize = getAppropriateFrameSize(jsonobj.z)

    //Parse and assign the ideal position for the element
    //Use normalized x, y to get appropriate offset for the element
    tr_pos[i] = new Vector(jsonobj.x,
                           jsonobj.y,
                           jsonobj.z)
    tr_height[i] = jsonobj.height

    newEl.id = "trackie";
    newEl.src = "Images/"+jsonobj.src;
    newEl.style = "z-index:"+jsonobj.z+"px;position: fixed;";

    trackies[i] = newEl
    scaleElement(i)

    document.body.appendChild(newEl)
  }
}

function track(v3_mouseToUse){
    //The vector defining the direction and magnitude to move
  var v3_trackVector = v3_mouseToUse
  v3_trackVector = v3_trackVector.subtract(getOrigin())

    //Get the clamped magnitude of the vector in 0...1 to indicate how far elements should move
  var magnitude = Math.min(v3_trackVector.length(), getMaxDetectionRadius()) / getMaxDetectionRadius()
    //Move farther if the magnitude is high
  v3_trackVector = v3_trackVector.unit().multiply(getMaxMovementRadius() * magnitude)

  for (var i=0; i<trackies.length; i++) {
    var el = trackies[i]

      //Get the position that the element should inhabit this frame
    var v3_basePos = getOrigin().add(tr_pos[i].multiply(getWindowMin() / 2))
    //v3_basePos = v3_basePos.add(v3_startPos)
    v3_basePos = v3_basePos.add(v3_trackVector.multiply(tr_pos[i].z))

      //Place element at the target
    setElementPos(el, v3_basePos)

    scaleElement(i)
  }

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
  mouseLerp(frameSmooth)
  mouseBob(bobrate, bobmagnitude)
  track(getMouseBobbed())
  //positionIcons()
}, 1000 / trackFramerate);


function scaleElement(i) {
  setElementHeight(trackies[i], tr_height[i] * getWindowMin()/2)
}

window.onload = function(){
  setDimensions()
  initializeTrackies()
  //initializeIcons()
};

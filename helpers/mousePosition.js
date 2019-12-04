

//Actual position of the mouse this frame
var v3_mousePos = new Vector()
//Position that lags behind the mouse
var v3_lerpedMousePos = new Vector()
//Position that bobs with time relative to lerped position
var v3_bobbedMousePos = new Vector()


function getMouseRaw() {
  return v3_mousePos
}

function getMouseLerped() {
  return v3_lerpedMousePos
}

function getMouseBobbed() {
  return v3_bobbedMousePos
}

//From https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
// BEGIN

document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
  var dot, eventDoc, doc, body, pageX, pageY;

  event = event || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y
  // are, calculate pageX/Y - logic taken from jQuery
  // Calculate pageX/Y if missing and clientX/Y available
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
      (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
      (doc && doc.clientTop  || body && body.clientTop  || 0 );
  }

v3_mousePos.x = event.pageX
v3_mousePos.y = event.pageY
};
//END

//Move lerped mouse towards raw mouse by an amount equal to lerpFactor
function mouseLerp(lerpFactor) {
  v3_lerpedMousePos = Vector.lerp(v3_lerpedMousePos, v3_mousePos, lerpFactor)
}

//Set bobbed mouse to lerped mouse, bobbed by sin of time
//param:
//  rate - number of bobs per pi seconds
//  0...
//  magnitude - max height of bob, in ratio of original frame size
//  0...1
function mouseBob(rate, magnitude) {
  v3_bobbedMousePos = v3Bob(v3_lerpedMousePos, rate, magnitude * getWindowMin())
}

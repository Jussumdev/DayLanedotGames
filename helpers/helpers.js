

function setElementPos(element, v3_newPos, round = true) {
  if (round) {
    element.style.left = Math.round(v3_newPos.x - (element.offsetWidth/2)) + "px"
    element.style.top = Math.round(v3_newPos.y - (element.offsetHeight/2)) + "px"
  } else {
    element.style.left = v3_newPos.x - (element.offsetWidth/2) + "px"
    element.style.top = v3_newPos.y - (element.offsetHeight/2) + "px"
  }
}

function getElementPos(element) {
  return new Vector(
    element.offsetLeft + (element.offsetWidth/2),
    element.offsetTop + (element.offsetHeight/2),
    0
  )
}

function setElementHeight(element, newHeight) {
  element.style.height = newHeight + "px"
}

function setElementWidth(element, newHeight) {
  element.style.width = newHeight + "px"
}

function lerp(source, target, coeff){
  var term1 = target * coeff
  var term2 = source * (1-coeff)
  return term1 + term2
}

//Bob a number by sin of time
//param:
//  rate - number of bobs per pi seconds
//  0...
//  magnitude - max height of bob, in pixels
//  0...1
//  offset - offset in seconds from the standard time
function numBob(num, rate, magnitude, offset) {
  var sec = (new Date()).getTime() / 1000
  sec += offset
  var bob = Math.sin(sec * rate)
  // sec *= rate
  // sec += offset
  // var bob = Math.sin(sec)
  return num + (bob * magnitude)
}

//Return [num] rounded to [decimals] decimal places
function roundDecimals(num, decimals) {
  var mult = Math.pow(10, decimals)
  return Math.round(num * mult) / mult
}

//Bob a position by sin of time
//param:
//  rate - number of bobs per pi seconds
//  0...
//  magnitude - max height of bob, in pixels
//  0...1
//  offset - offset in seconds from the standard time
function v3Bob(v3_position, rate, magnitude, offset = 0) {
  v3_position.y = numBob(v3_position.y, rate, magnitude, offset)
  return v3_position
}

function isLetter(str) {

  return str.length === 1 && str.match(/[a-z]/i);
}

function clamp(a, min, max) {
  return Math.min(Math.max(a, min), max);
}

// from https://stackoverflow.com/questions/9434/add-multiple-window-onload-events
function addOnLoad(fn)
{
   if (window.onload) {
     var old = window.onload;
     window.onload = function()
     {
         old();
         fn();
     };
   }
   else {
     window.onload = function(){fn();}
   }
}

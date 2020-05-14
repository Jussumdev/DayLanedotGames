
//When the window loads, begins periodically rotating all elements in the scene of the class "js_rotate"
//
//You may specify the following data on each element of the class "js_rotate":
//  "js_rotate_magnitude" - the maximum number of degrees this element will rotate
//  "js_rotate_rate" - the number of rotations in a second for this element

var rotate_elements = [];
var rotate_offsets = [];
var rotate_rate = [];
var rotate_magnitude = [];
var rotate_rate_default = 1;
var rotate_magnitude_default = 3;


function getRotationElements(){
  rotate_elements = document.getElementsByClassName("js_rotate");
  for (var i=0; i<rotate_elements.length; i++) {
    rotate_offsets[i] = Math.random() * 5.0;
    var el = rotate_elements[i]
    rotate_rate[i] = el.hasAttribute("data-js_rotate_rate") ? el.getAttribute("data-js_rotate_rate") : rotate_rate_default;
    rotate_magnitude[i] = el.hasAttribute("data-js_rotate_magnitude") ? el.getAttribute("data-js_rotate_magnitude") : rotate_magnitude_default;
  }
}

function setRotation(){
  for (var i=0; i<rotate_elements.length; i++) {
    var el = rotate_elements[i];
    el.style.transform = "rotate("+numBob(0, rotate_rate[i], rotate_magnitude[i], rotate_offsets[i])+"deg)";
  }
}

addOnLoad(getRotationElements);
addOnLoad(setRotation);

//Frames per second
var framerate = 60
window.setInterval(function(){
  setRotation();
}, 1000 / framerate);

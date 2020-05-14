
//When the window loads, begins periodically bobbing all letters within text in containers of the class "js_bob"
//
//handles &nbsp, but doesn't handle other such characters
//
//You may specify the following data on each container of the class "js_bob":
//  "js_bob_rate" - the number of bobs in a second for each character in this container
//  "js_bob_magnitude" - the maximum distance each character in the container will bob up or down, in em units
//  "js_bob_letter_offset" - the time offset in seconds between each subsequent character in the container
//Alternatively, you can specify all three at once:
//  "js_bob_var" - all three variables in the form:
//    [js_bob_rate],[js_bob_magnitude],[js_bob_letter_offset]
//  for example:
//    data-js_bob_var='5,0.2,0.1'
//
//You may also specify a single element anywhere on the page of the class "js_bob_settings"
//If you do, data on this element will be applied to any js_bob elements without their own data (instead of defaults)
//Only the first element with this class will be used, all subsequent ignored

var bob_spans = [];
var bob_chars = [];

var bob_rate_default = 1;
var bob_magnitude_default = 1;
var bob_letter_offset_default = 1;

function findBobSettings(){
  var el = document.getElementsByClassName("js_bob_settings")[0]
  if (el == null){
    return;
  }
  //All the variables are packaged together
  if (el.hasAttribute("data-js_bob_var")){
    var vars = el.getAttribute("data-js_bob_var").split(',')
    bob_rate_default = vars[0]
    bob_magnitude_default = vars[1]
    bob_letter_offset_default = vars[2]
  }
  //Not packaged together; there might be less than 3 of them
  else{
    bob_rate_default = el.hasAttribute("data-js_bob_rate") ? el.getAttribute("data-js_bob_rate") : bob_rate_default;
    bob_magnitude_default = el.hasAttribute("data-js_bob_magnitude") ? el.getAttribute("data-js_bob_magnitude") : bob_magnitude_default;
    bob_letter_offset_default = el.hasAttribute("data-js_bob_letter_offset") ? el.getAttribute("data-js_bob_letter_offset") : bob_letter_offset_default;
  }
}

function getBobElements(){
  bob_spans = document.getElementsByClassName("js_bob");

  console.log(bob_spans);

  //For each element with the class js_bob
  for (var i=0; i<bob_spans.length; i++) {
    var el = bob_spans[i];

    var rate, magnitude, offsetPerLetter

    //Get variables applied to all characters in this element
    //All the variables are packaged together
    if (el.hasAttribute("data-js_bob_var")){
      var vars = el.getAttribute("data-js_bob_var").split(',')
      rate = vars[0]
      magnitude = vars[1]
      offsetPerLetter = vars[2]
    }
    //Not packaged together; there might be less than 3 of them
    else{
      rate = el.hasAttribute("data-js_bob_rate") ? el.getAttribute("data-js_bob_rate") : bob_rate_default;
      magnitude = el.hasAttribute("data-js_bob_magnitude") ? el.getAttribute("data-js_bob_magnitude") : bob_magnitude_default;
      offsetPerLetter = el.hasAttribute("data-js_bob_letter_offset") ? el.getAttribute("data-js_bob_letter_offset") : bob_letter_offset_default;
    }

    var textInEl = el.innerHTML;
    var chars = textInEl.split("");

    var html = "";
    var offset = 0;

    //For each character in that class
    for (var j=0; j<chars.length; j++) {
      var charToAdd;
      if (chars[j] == '&') { //rudimentary workaround for &nbsp
        charToAdd = "&nbsp";
        j+=5;
      }
      else {
        charToAdd = chars[j]
      }

      html+= "<span class=bob_enabled data-offset='"+offset+"' data-rate='"+rate+"' data-magnitude='"+magnitude+"'>"+charToAdd+"</span>";
      offset+=parseFloat(offsetPerLetter);
    }

    el.innerHTML = html;

  }

  bob_chars = document.getElementsByClassName("bob_enabled");
  console.log(bob_chars);

}

function setBob(){
  for (var i=0; i<bob_chars.length; i++) {
    var el = bob_chars[i];
    var char_offset = numBob(
      0,
      el.getAttribute('data-rate'),
      el.getAttribute('data-magnitude'),
      roundDecimals(el.getAttribute('data-offset'), 2)
    );
    console.log(char_offset)
    el.style = "position:relative;top:"+char_offset+"em;"
  }
}


addOnLoad(findBobSettings);
addOnLoad(getBobElements);

//Frames per second
var framerate = 60
window.setInterval(function(){
  setBob();
}, 1000 / framerate);

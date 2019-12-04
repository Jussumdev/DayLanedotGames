
  //2D Array of all letter images, once initialized
  //letters[i][j] is the 'j'th letter in the 'i'th piece of text
var letters = []
  //Array of Vector positions -0.5...0.5 (character's location, in character widths / heights, within the relative width and height of the text block)
  //letters[i][j] has starting position letter_pos[i][j] relative to center of screen
var letter_pos = []
  //Random offsets for the letters bob effects
  //letters[i][j] has bob offset of bob_offsets[i][j]
var bob_offsets = []
  //Container divs containing all the letter objects
  //line_elements[i] has children letters[i][0...j]
var line_elements = []

var actual_JSON = getLetterData().array;

var textAspect
var letterHeight
var letterWidth

  //Aspect ratio of all letter images (width / height)
const letterAspect = (14 / 20);
  //Space between letters, in letter width
const letterSpace = 0.8;
  //Space between lines, in letter height
const lineSpace = 3.8;
  //Size, in letter percentage, of the clickable large div around each letter
const linkBorderPercent = 200;
  //Margins of the page, x = horizontal, y = vertical
const margins = new Vector(0.05, 0.05, 0);


//Number of letter bobs per second
var bobrate = 0.6
//Magnitude of max letter bob relative to letter height
var bobmagnitude = 0.1

function initializeLetters() {

  scaleLetters();

  pos_y = -0.5 * (actual_JSON.length - 1 + ((actual_JSON.length - 1) * lineSpace));

  //Create letters according to the js data structure
  for (var i=0; i<actual_JSON.length; i++) {
    var jsonobj = actual_JSON[i];
    var line = jsonobj.text;

    letters[i] = [];
    letter_pos[i] = [];
    bob_offsets[i] = [];

    //Make a style class for this line
    var className = 'lineClass'+i;
    var newStyle = document.createElement('style');
    newStyle.type = 'text/css';
    newStyle.innerHTML = '.'+className+':hover { opacity: 0.4; }';

    //Make a container for this line
    var lineEl = document.createElement("div");
    lineEl.className = className
    lineEl.style = "position: fixed";

    document.getElementsByTagName('head')[0].appendChild(newStyle);

    pos_x = -0.5 * (line.length - 1 + ((line.length - 1) * letterSpace));

    for (var j=0; j<line.length; j++) {

      var letter = jsonobj.text.charAt(j);

      var newEl = document.createElement("a");
      newEl.href = jsonobj.link;
      newEl.id = "letter";
      newEl.style = "position: fixed";

      //Assign the ideal position for the element
      letter_pos[i][j] = new Vector(
        pos_x,
        pos_y,
        0
      );

      //make an image of the letter and attach it to the main object
      var elP = document.createElement("p");
      if (isLetter(letter)) {
        elP.innerHTML = letter;
      } else {
        elP.innerHTML = " ";
      }
      elP.style = "font-size: 100%; text-align: center; vertical-align: middle; color: "+jsonobj.col+"; text-shadow: 0px 0.12em 0vh #777777;";
      elP.className = className;
      newEl.appendChild(elP);

        //Make an extra large div outside so there is spare space to hover, center it in the smaller div
        //https://stackoverflow.com/questions/18082108/larger-div-centered-inside-smaller-div/18082300
      var elLarge = document.createElement("div");
      elLarge.style = "position : absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); height: "+linkBorderPercent+"%; width: "+linkBorderPercent+"%;";
      newEl.appendChild(elLarge);

      letters[i][j] = newEl
      bob_offsets[i][j] = Math.random() * 8.0;

      lineEl.appendChild(newEl);

      pos_x += 1 + letterSpace;
    }

    document.body.appendChild(lineEl);

    line_elements[i] = lineEl;

    pos_y += 1 + lineSpace;
  }

  //console.log(letter_pos)
}

function positionLetters(){

  v3_textWidthHeight = getTextBlockWidthHeight();
  v3_windowDim = getWindowDim();

  for (var i=0; i<letters.length; i++) {

    for (var j=0; j<letters[i].length; j++) {
      var el = letters[i][j];

        //Get the position that the element should inhabit this frame
      var v3_basePos = getOrigin().add(
        letter_pos[i][j].multiply(letterHeight / 2)
      );

        //Scale the text to fit the margins
      v3_basePos = v3_basePos.multiply(new Vector(1,1,0).subtract(margins.multiply(2)));
        //Center the text using the margins
      v3_basePos = v3_basePos.add(margins.multiply(v3_windowDim));


      v3_basePos = v3Bob(v3_basePos, bobrate, bobmagnitude * letterHeight, bob_offsets[i][j]);
      el.style.transform = "rotate("+numBob(0, 0.45, 10, bob_offsets[i][j])+"deg)"

        //Place element at the target
      setElementPos(el, v3_basePos, round = false);

    }


  }

}

//Exponentially smaller value results in linearly smoother mouse motion
var mouseSmoothing = 0.000001
//Frames per second
var trackFramerate = 60

var thisFrameTime = (new Date()).getTime()
var lastFrameTime = thisFrameTime

window.setInterval(function(){
  thisFrameTime = (new Date()).getTime()
  var dt = thisFrameTime - lastFrameTime
  lastFrameTime = thisFrameTime
  //console.log(dt)

  var frameSmooth = 1 - Math.pow(mouseSmoothing, dt / 1000)
  mouseLerp(frameSmooth)
  positionLetters()

}, 1000 / trackFramerate);




window.addEventListener("resize", scaleLetters);

window.onload = function(){
  setDimensions()
  initializeLetters()
  scaleLetters()
};

function getTextBlockWidthHeight() {
  var longestStr = "";
  for (var i=0; i<actual_JSON.length; i++) {
    if (actual_JSON[i].text.length > longestStr.length) {
      longestStr = actual_JSON[i].text;
    }
  }

    //Width of the text block (in characters width units)
  var unscaledWidth = longestStr.length + ((longestStr.length - 1) * letterSpace);
    //Height of the text block (in character height units)
  var unscaledHeight = actual_JSON.length + ((actual_JSON.length - 1) * lineSpace);

  return new Vector(unscaledWidth * letterAspect, unscaledHeight, 0);
}

function scaleLetters() {

  v3_textWidthHeight = getTextBlockWidthHeight();

    //Aspect ratio of the textblock
  textAspect = v3_textWidthHeight.x / v3_textWidthHeight.y;
  //console.log(v3_textWidthHeight);
  //console.log(textAspect+" "+getAspectRatio());

  if (textAspect > getAspectRatio()) {
    //If text block is relatively wider than the screen, scale horizontally
    letterWidth = getWindowDim().x / v3_textWidthHeight.x;
    letterHeight = letterWidth / letterAspect;
  } else {
    //If text block is relatively taller (or same aspect ratio), scale vertically
    letterHeight = getWindowDim().y / v3_textWidthHeight.y;
    letterWidth = letterHeight * letterAspect;
  }

  for (var i=0; i<letters.length; i++) {
    for (var j=0; j<letters[i].length; j++) {
      setElementHeight(letters[i][j], letterHeight);
      setElementWidth(letters[i][j], letterHeight * letterAspect);
      letters[i][j].style.setProperty("font-size", letterHeight+"px");
    }
  }

  //console.log(letterHeight);

}

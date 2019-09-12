
//
// // Create cross browser requestAnimationFrame method:
// window.requestAnimationFrame = window.requestAnimationFrame
//  || window.mozRequestAnimationFrame
//  || window.webkitRequestAnimationFrame
//  || window.msRequestAnimationFrame
//  || function(f){setTimeout(f, 1000/60)}


  //Size of clickable area compared to the size of the floating icon
const clickableSize = 1.15
  //Minimum number of elements on the first side
const minimumIconsOnSide = 3

  //Array of all clickable  elements, once initialized. Do not move with time
var icons = []
  //Array of all images within clickable elements, that move and bob
var iconImages = []
  //Offset (in seconds) of the bob animation for each icon
var offsets = []

function initializeIcons() {
  var actual_JSON = getIconData().array

  //Create icons according to the js data structure
  for (var i=0; i<actual_JSON.length; i++) {
    var newEl = document.createElement("a");
    var elIMG = document.createElement("img");

    var jsonobj = actual_JSON[i];

    newEl.href = jsonobj.link;

    elIMG.id = "icon";
    elIMG.src = "Images/"+jsonobj.src;
    elIMG.style = "height: "+(100/clickableSize)+"%;" + "position: relative";

    newEl.style = "position: fixed"

    newEl.appendChild(elIMG)

    icons[i] = newEl
    iconImages[i] = elIMG

    offsets[i] = Math.random() * 10
    //scaleElement(i)

    setElementPos(newEl, new Vector(200, 200, 0))

    document.body.appendChild(newEl)
  }
}


function positionIcons(){
  var v3_windowDim = getWindowDim()
  var horizontal = getAspectRatio() > 1

    //Number of total icons to place
  var iconCount = icons.length
    //Number of icons in the first of the two icon columns
  var firstColumn = horizontal ? Math.ceil(iconCount / 2) : iconCount
  //var firstColumn = Math.ceil(iconCount / 2)
    //If there are few elements, ensure a mininum of elements on the first side
  firstColumn = Math.max(firstColumn, minimumIconsOnSide)
    //Number of icons in the second of the two icon columns
  var secondColumn = iconCount - firstColumn

  var horizOffsetMin = horizontal ? 0.15 : 0.25
  var horizOffsetMax = horizontal ? 0.25 : 0.25
  var verticalMin = 0.08
  var verticalMax = 0.92

  var bob_mag = v3_windowDim.y * 0.01

  lerp(horizOffsetMax, horizOffsetMin)

  for (var i=0; i<icons.length; i++) {
    var el = icons[i]
    var img = iconImages[i]
      //Place element at the target

      //Ratio 0...1 from the top of the screen to the bottom
    var yRatio = 0

    if (i < firstColumn) {
      yRatio = (i + 0.5) / (firstColumn)
    } else {
      yRatio = (i - firstColumn + 0.5) / (secondColumn)
    }

      //The top offset of this icon
    var offset_y = lerp(verticalMin, verticalMax, yRatio) * v3_windowDim.y
    var xRatio = Math.sin(yRatio * Math.PI)
    var offset_x = lerp(horizOffsetMax, horizOffsetMin, xRatio)
    offset_x += horizontal ? 0 : ((i+1)%2) * 0.1
    offset_x *= v3_windowDim.x

    if (i >= firstColumn) {
      //offset_x = horizontal ? v3_windowDim.x - offset_x : offset_x + v3_windowDim.x * 0.2
      offset_x = v3_windowDim.x - offset_x
    }


      //Set clickable element height
    var height = horizontal ?
      v3_windowDim.y / firstColumn / 2 :
      v3_windowDim.x / firstColumn
    setElementHeight(el, height * clickableSize)

      //Set the position of the clickable link
    setElementPos(el, new Vector(offset_x, offset_y, 0), true)

    var v3_basePos = (new Vector(height, height, 0)).multiply(0.5)
    var v3_pos = v3Bob(v3_basePos, 0.35, bob_mag, offsets[i])
    img.style.transform = "rotate("+numBob(0, 0.45, 10, offsets[i])+"deg)"

      //Set the position of the internal image
    setElementPos(img, v3_pos, false)

  }

}

// function scaleElement(i) {
//   setElementHeight(trackies[i], tr_height[i] * getWindowMin()/2)
// }

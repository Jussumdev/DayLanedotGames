

var aspect_ratio, windowMin, original_frame_size, max_expanded_frame_size, max_detection_radius, max_movement_radius, v3_origin, v3_windowDim

function getWindowMin() {
  return windowMin
}

function getWindowMinRaw() {
  return windowMinRaw
}

function getMaxDetectionRadius() {
  return max_detection_radius
}

function getMaxMovementRadius() {
  return max_movement_radius
}

function getOrigin() {
  return v3_origin
}

function getWindowDim() {
  return v3_windowDim
}

function getAspectRatio() {
  return aspect_ratio
}


window.addEventListener("resize", setDimensions);


function setDimensions() {
  v3_windowDim = new Vector(window.innerWidth, window.innerHeight, 0)
  //console.log("Resized window to "+v3_windowDim.x+", "+v3_windowDim.y)

  aspect_ratio = v3_windowDim.x / v3_windowDim.y

  windowMin = Math.min(v3_windowDim.x, v3_windowDim.y)
  windowMinRaw = windowMin

  v3_origin = new Vector(v3_windowDim.x / 2, v3_windowDim.y / 2, 0)

  if (aspect_ratio > 1) {
    //Desktop
      //The size and positioning of elements lerps between these two values using z{0...1}
      //This mimics perspective, since closer elements are larger and more spread out
    original_frame_size = windowMin * 0.5      //The size of the frame for z = 0
    max_expanded_frame_size = windowMin * 0.6   //The size of the frame for z = 1
  } else {
    //Mobile
    original_frame_size = windowMin * 1
    max_expanded_frame_size = windowMin * 1.2
  }

    //Detection radius for mouse
  max_detection_radius = windowMin * 0.75

  max_movement_radius = original_frame_size * 0.2

}

function getAppropriateFrameSize(zvalue) {
    return lerp(original_frame_size, max_expanded_frame_size, zvalue)
}

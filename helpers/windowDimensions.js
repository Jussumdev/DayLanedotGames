

var aspect_ratio, windowMin, frame_size, max_detection_radius, max_movement_radius, v3_origin, v3_windowDim

function getWindowMin() {
  return windowMin
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

function getFrameSize() {
  return frame_size
}


window.addEventListener("resize", setDimensions);


function setDimensions() {
  v3_windowDim = new Vector(window.innerWidth, window.innerHeight, 0)
  //console.log("Resized window to "+v3_windowDim.x+", "+v3_windowDim.y)

  aspect_ratio = v3_windowDim.x / v3_windowDim.y

  windowMin = Math.min(v3_windowDim.x, v3_windowDim.y)

  v3_origin = new Vector(v3_windowDim.x / 2, v3_windowDim.y / 2, 0)

  if (aspect_ratio > 1) {
    //Desktop
    frame_size = windowMin * 0.5
  } else {
    //Mobile
    frame_size = windowMin * 1.1
  }

    //Detection radius for mouse
  max_detection_radius = windowMin * 0.75

  max_movement_radius = frame_size * 0.2

  console.log(frame_size, max_detection_radius, max_movement_radius)

}

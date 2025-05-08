let live2dModel = null;
const live2dCanvas = document.getElementById('live2dCanvas');
const videoPreview = document.getElementById('videoPreview');

function setUpLive2DModel() {
  loadlive2d("live2dCanvas", "path/to/your/live2d/model.json", () => {
    console.log('Live2D model successfully loaded');
    live2dModel = document.getElementById('live2dCanvas').getContext('webgl');
  });
}

function activateVideoPreview() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoPreview.srcObject = stream;
    })
    .catch(err => {
      console.error('Unable to access the webcam:', err);
    });
}

function refreshLive2DModel(detectState) {
  if (!live2dModel) return;

  const horizontalHeadMovement = detectState.expressions.headX || 0; // Adjust as necessary
  const verticalHeadMovement = detectState.expressions.headY || 0;

  live2dModel.setParamFloat("PARAM_ANGLE_X", horizontalHeadMovement * 30); // Modify sensitivity
  live2dModel.setParamFloat("PARAM_ANGLE_Y", verticalHeadMovement * 30);
}

function initiateTracking() {
  WebARRocksFaceDebugHelper.init({
    spec: {
      NNCPath: 'https://cdn.jsdelivr.net/gh/WebAR-rocks/WebAR.rocks.face@latest/neuralNets/NN_AUTOBONES_21.json'
    },
    callbackReady: function(err, spec) {
      if (err) {
        console.error('Initialization error:', err);
        return;
      }
      setUpLive2DModel();
      activateVideoPreview();
    },
    callbackTrack: function(detectState) {
      refreshLive2DModel(detectState);
    }
  })
}

function initialize() {
  WebARRocksResizer.size_canvas({
    canvasId: 'WebARRocksFaceCanvas',
    callback: initiateTracking
  });
}

window.addEventListener('load', initialize);
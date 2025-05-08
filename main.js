let live2dModel = null;
const live2dCanvas = document.getElementById('live2dCanvas');
const videoPreview = document.getElementById('videoPreview');

function initLive2D() {
  loadlive2d("live2dCanvas", "path/to/your/live2d/model.json", () => {
    console.log('Live2D model loaded');
    live2dModel = document.getElementById('live2dCanvas').getContext('webgl');
  });
}

function initVideoPreview() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoPreview.srcObject = stream;
    })
    .catch(err => {
      console.error('Error accessing webcam:', err);
    });
}

function updateLive2D(detectState) {
  if (!live2dModel) return;

  const headX = detectState.expressions.headX || 0; // Change based on actual data
  const headY = detectState.expressions.headY || 0;

  live2dModel.setParamFloat("PARAM_ANGLE_X", headX * 30); // Adjust sensitivity
  live2dModel.setParamFloat("PARAM_ANGLE_Y", headY * 30);
}

function start() {
  WebARRocksFaceDebugHelper.init({
    spec: {
      NNCPath: 'https://cdn.jsdelivr.net/gh/WebAR-rocks/WebAR.rocks.face@latest/neuralNets/NN_AUTOBONES_21.json'
    },
    callbackReady: function(err, spec) {
      if (err) {
        console.error('An error occurred:', err);
        return;
      }
      initLive2D();
      initVideoPreview();
    },
    callbackTrack: function(detectState) {
      updateLive2D(detectState);
    }
  })
}

function main() {
  WebARRocksResizer.size_canvas({
    canvasId: 'WebARRocksFaceCanvas',
    callback: start
  });
}

window.addEventListener('load', main);
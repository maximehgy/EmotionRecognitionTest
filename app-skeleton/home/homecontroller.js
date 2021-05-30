myApp.controller('HomeController', ["$scope", "$state",

  function($scope, $state) {







    $scope.selected = function() {


    var p = document.getElementById("success");
    p.innerHTML="";
    const btn = document.getElementById("button");

    var displaySize = {
      width : "0",
      height : "0"
    }
    var canvas;

    Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
]).then(getImage);

    const fileUpload = document.getElementById("fileUpload");
    if(fileUpload.files[0]==null){
      $scope.ok =" Please choose a file"
      p.append($scope.ok);
    }
    const uploadedImageDiv = document.getElementById("uploadedImage");
    const appdiv = document.getElementById("appear");





    function getImage() {
      console.log("images", fileUpload.files[0]);
      const imagefinal = fileUpload.files[0];
      let newImage = new Image();

      newImage.style.width = '50%';
      newImage.style.height='auto';
      newImage.src = URL.createObjectURL(imagefinal);
      uploadedImageDiv.innerHTML="";
      uploadedImageDiv.appendChild(newImage);
      Chargement(newImage);





    }

  function processImage(image, displaySize,canvas){
    (async () => {

    //  const detection = await faceapi.detectAllFaces(image);


    faceapi.matchDimensions(canvas,displaySize);
    let detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks().withFaceExpressions();
    console.log(detections.length);

    if (detections.length<=0){
      $scope.ok = "An error occured :( Try again";
    }
    else {
      $scope.ok = "Here are your expressions :"
    }

    p.append($scope.ok);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    console.log(canvas.width, canvas.height);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    canvas.style.top= "image.style.top";
    canvas.style.left="image.style.left";
    uploadedImageDiv.append(canvas);

  })();


  }

  function Chargement(image) {
  return new Promise((resolve, reject) => {
    image.onload = function () {
      var height = this.height;
      var width = this.width;
      displaySize.width = width;
      displaySize.height = height;
      canvas = faceapi.createCanvasFromMedia(image);
      console.log(canvas.width, canvas.height);
      processImage(image, displaySize,canvas);
    }
    image.onerror = () => {$scope.ok ="An error occured" ; }
  });
}

    }
  }
]);

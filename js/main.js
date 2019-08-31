function readPath(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#cls_img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}


let net;
var webcam_runnig=false;

async function app() {
  console.log('Loading mobilenet..');
  document.getElementById("result").innerHTML="Running";
  document.getElementById("pred_1").innerHTML ="Finding...";
  document.getElementById("conf_1").style.width=Math.floor(Math.random() * 100).toString()+'%';
 
  document.getElementById("pred_2").innerHTML ="Finding...";
  document.getElementById("conf_2").style.width=Math.floor(Math.random() * 100).toString()+'%';
  
  document.getElementById("pred_3").innerHTML ="Finding...";
  document.getElementById("conf_3").style.width=Math.floor(Math.random() * 100).toString()+'%';
  

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  // Make a prediction through the model on our image.
  
  const imgEl = document.getElementById('cls_img');
  console.log('sss');

  const result = await net.classify(imgEl);
  // document.getElementById('header').style.width = 
  document.getElementById("pred_1").innerHTML =result[0].className;
  document.getElementById("conf_1").style.width= Math.round(result[0].probability*100).toString()+'%';
 
  document.getElementById("pred_2").innerHTML =result[1].className;
  document.getElementById("conf_2").style.width= Math.round(result[1].probability*100).toString()+'%';
  
  document.getElementById("pred_3").innerHTML =result[2].className;
  document.getElementById("conf_3").style.width= Math.round(result[2].probability*100).toString()+'%';
  
  console.log(Math.round(result[0].probability*100))
  console.log(result);
  document.getElementById("result").innerHTML="Result";

}


const webcamElement = document.getElementById('webcam');
var webcamStream;

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;

          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
          webcamStream=stream;
        },
        error => reject());
    } else {
      reject();
    }

  });
}

async function app_webcam() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');
  
  await setupWebcam();
  var track = webcamStream.getTracks()[0];  
  while (webcam_runnig) {
    const result = await net.classify(webcamElement);
 	console.log(result);

    document.getElementById("pred_1").innerHTML =result[0].className;
	document.getElementById("conf_1").style.width= Math.round(result[0].probability*100).toString()+'%';

	document.getElementById("pred_2").innerHTML =result[1].className;
	document.getElementById("conf_2").style.width= Math.round(result[1].probability*100).toString()+'%';

	document.getElementById("pred_3").innerHTML =result[2].className;
	document.getElementById("conf_3").style.width= Math.round(result[2].probability*100).toString()+'%';

    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame();
  }
  track.stop();
}

app();
$("#inputGroupFile04").change(function(){
	app();
    readPath(this);
});


$("#option2").change(function(){
    $("#cls_img").addClass("d-none");
    $("#webcam").removeClass("d-none");
    webcam_runnig=true;
    app_webcam();
});

$("#option1").change(function(){
    $("#cls_img").removeClass("d-none");
    $("#webcam").addClass("d-none");
    webcam_runnig=false;
	app();
});

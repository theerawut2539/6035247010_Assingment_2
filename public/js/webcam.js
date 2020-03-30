const webcam = document.getElementById("webcam");
const webcamOverlay = document.getElementById("webcamOverlay");



var labelsFaceDescriptors = [];


var run = async ()=>{
    console.log('Model Loading');
    await loadModels();
    console.log('Model Loaded');

    const facesDb = await db.allDocs({include_docs:true,attachments:true})

    facesDb.rows.forEach(async i =>{
        let obj = {};
        obj._id = i.doc._id;
        obj.name = i.doc.title + i.doc.name + ' '+ i.doc.lastname;
        
        

        obj.degree = i.doc.degree;
        obj.sector = i.doc.sector;
        obj.Subject = i.doc.Subject;
        obj.work = i.doc.work;

        obj.Title = i.doc.Title;
        obj.name = i.doc.name;
        obj.lastname = i.doc.lastname;
        obj.day = i.doc.day;
        obj.Age = i.doc.Age;

        obj.BEducational = i.doc.BEducational;
        obj.Year = i.doc.Year;
        obj.School = i.doc.School;
        obj.District1 = i.doc.District1;
        obj.Province1 = i.doc.Province1;
        obj.Gpa = i.doc.Gpa;
        obj.Special = i.doc.Special;

        obj.HouseNo = i.doc.HouseNo;
        obj.Village = i.doc.Village;
        obj.Street = i.doc.Street;
        obj.SubDistrict = i.doc.SubDistrict;
        obj.District2 = i.doc.District2;
        obj.province2 = i.doc.province2;
        obj.Postcode = i.doc.Postcode;
        obj.Htel = i.doc.Htel;
        obj.Ptel = i.doc.Ptel;




        console.log(obj);
        labelsFaceDescriptors.push(obj);
    })
    

    if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
        webcam.srcObject = stream;
        })
        .catch(function (err0r) {
        console.log("Something went wrong!");
        });
    }
}

async function onPlay() {
    if(webcam.paused || webcam.ended)
      return setTimeout(() => onPlay())
      
      const options = new faceapi.SsdMobilenetv1Options({ minConfidence });
      
      const detections = await faceapi.detectAllFaces(webcam, options)
      .withFaceLandmarks()
      .withFaceDescriptors()
      if (detections) {
        //    console.log(detections)
        webcamOverlay.style.display = 'block';
        webcamOverlay.style.position = "absolute";
        webcamOverlay.style.left = webcam.offsetLeft + "px";
        webcamOverlay.style.top = webcam.offsetTop + "px";
        webcamOverlay.getContext('2d').clearRect(0, 0, webcamOverlay.width, webcamOverlay.height);
        const dims = await faceapi.matchDimensions(webcamOverlay, webcam, true);
        var resizedDetections = await faceapi.resizeResults(detections, dims);
        await faceapi.draw.drawDetections(webcamOverlay, resizedDetections);

        detections.forEach(async faceDetect => {
            labelsFaceDescriptors.forEach(faceDB =>{
                var distance = faceapi.round(
                    faceapi.euclideanDistance(faceDetect.descriptor,faceDB.descriptor)
                )

                 console.log(distance)
                if(distance <= 0.35){
                    console.log(faceDB.name);
                }
            })
        })
      }else{
        webcamOverlay.getContext('2d').clearRect(0, 0, webcamOverlay.width, webcamOverlay.height);
      }
    //   setTimeout(() => onPlay())
  }

run();
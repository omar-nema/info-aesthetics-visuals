
let track;

//rate, pan, reverb
//add sliders for everything and get it working

let btnPlayPause;

let paramReverb, sliderReverb;

let attrAmp;

function preload() {
    // soundFormats('wav')
    track = loadSound('6a.wav')
}


function setup() {
    createCanvas(400, 400)   
    btnPlayPause = createButton('play/pause')
    btnPlayPause.mousePressed(playPause);

    sliderReverb = createSlider(0, 1, .5, .1);
    attrAmp = new p5.Amplitude();
  
}

function playPause(){
    if (track.isPlaying() == true){
        track.pause()
    } else {
        track.play();
    }
}

function updateParams(){

}

var noiseoff = 0;
function draw() {


    // sphere(100)
    noFill()
    noLoop();

    if (track.isPlaying()  == true){
        console.log('uh')
        console.log(attrAmp.getLevel())
    }
    //console.log(track.getPan(), track.processPeaks(), track.getBPM());
    

    background(240);
    
    //noLoop();
    // background(0,0,noise(noiseoff)*150);
    // background('yellow')
    // for (i=0; i<7; i++){
    //     stroke(random(100,200))
    //     strokeWeight(0.4)
    //     n = map(noise(noiseoff),0,1, 1, 10)
    //     // shearX(random(PI / 140))
    //     // shearY(random(PI / 140))
    //     sphere(i*40+random(5,10))
        
    // }
    // noiseoff+=.1;
}

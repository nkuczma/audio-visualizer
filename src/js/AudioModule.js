function AudioModule(audioUrl) {
  let audio, analyser;
  let contextInitialized = false;

  function initializeAudio() {
    audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = audioUrl;
    audio.loop = true; 
  }

  function playAudio() {
    if(!contextInitialized) {
      let context = new AudioContext();
      let src = context.createMediaElementSource(audio);
      analyser = context.createAnalyser();
      src.connect(analyser);
      src.connect(context.destination);
      contextInitialized = true;
    } 
    audio.play();
  }

  function analyseAudio() {
    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  function pauseAudio() {
    audio.pause();
  }

  function loadAudio(file, onLoadFunction = function() {}) {
    audio.src = URL.createObjectURL(file[0]);
    audioUrl = file[0].name;
    audio.load();
    audio.addEventListener( 'canplaythrough', onLoadFunction(audioUrl), false );
  }

  return { initializeAudio, playAudio, pauseAudio, loadAudio, analyseAudio };

}

export default AudioModule;
function AudioModule(audioUrl) {
  let audio, analyser, animation;
  let contextInitialized = false;

  audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.src = audioUrl;
  audio.loop = true; 

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

  function loadAudio() {
      ///todo
  }

  return { playAudio, pauseAudio, loadAudio, analyseAudio };

}

export default AudioModule;
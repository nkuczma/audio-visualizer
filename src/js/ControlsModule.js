import VisualizationModule from './VisualizationModule';
import AudioModule from './AudioModule';

function ControlsModule(conf) {
	
	let animation, vis, audio;
	let controls = {};
	let nodeElements = [
		{	name: 'titleElement',
			element: 'div',
			attr: [
				['id', 'title']
			],
			children: []
		},
		{
			name: 'playAudioNode',
			element: 'button',
			text: 'Play Audio',
			attr: [
				[ 'id', 'play-audio' ],
				[ 'class', 'btn' ]
			],
			children: []
		},
		{
			name: 'pauseAudioNode',
			element: 'button',
			text: 'Pause Audio',
			attr: [
				[ 'id', 'pause-audio'],
				[ 'class', 'btn' ]
			],
			children: []
		},
		{
			name: 'audioFileButton',
			element: 'label',
			text: 'Add own file',
			attr: [
				[ 'id', 'input-file-button'],
				[ 'class', 'btn']
			],
			children: [
				{
					name: 'audioFileNode',
					element: 'input',
					attr: [
						[ 'id', 'audio-file' ],
						[ 'class', 'btn' ],
						[ 'type', 'file' ], 
						[ 'accept', 'audio/*']
					]
				}
			]
		}
	];

	function startAnimation() {
		function renderFrame() {
			animation = requestAnimationFrame(renderFrame);
			vis.drawWaves(audio.analyseAudio());
		}
		renderFrame();
	}

	function play() {
		controls.playAudioNode.classList.add('active');
		controls.pauseAudioNode.classList.remove('active');
		audio.playAudio();
		startAnimation();
	}

	function pause() {
		controls.playAudioNode.classList.remove('active');
		controls.pauseAudioNode.classList.add('active');
		audio.pauseAudio();
		cancelAnimationFrame(animation);
	}

	function onFileChange() {
		if(this.files.length !== 0) {
			controls.titleElement.innerHTML = 'Loading song...';
			controls.pauseAudioNode.classList.remove('active');
			controls.playAudioNode.classList.remove('active');
			controls.playAudioNode.disabled = true; 
			controls.pauseAudioNode.disabled = true;
			let file = this.files[0];
			audio.loadAudio(file, audioIsLoaded);
		}
	}

	function audioIsLoaded(audioName) {
		controls.titleElement.innerHTML = audioName.split('/').pop().split('.')[0];
		controls.playAudioNode.disabled = false; 
		controls.pauseAudioNode.disabled = false;
		controls.playAudioNode.classList.add('active');
		audio.playAudio();
		startAnimation();
	}

	function createControls() {
		let root = document.getElementById(conf.controlsRoot);
		nodeElements.forEach((el) => {
			controls[el.name] = document.createElement(el.element);
			el.attr.forEach((attr) => {
				controls[el.name].setAttribute(attr[0], attr[1]);
			})
			if(el.text) { controls[el.name].innerHTML = el.text; }
			if(el.children.length>0) {
				el.children.forEach( (child) => {
					controls[child.name] = document.createElement(child.element);
					child.attr.forEach((attr) => {
						controls[child.name].setAttribute(attr[0], attr[1]);
					})
					controls[el.name].appendChild(controls[child.name]);
				});
			}
			root.appendChild(controls[el.name]);
		})
	}

	function initialize() {
		createControls();
		vis = VisualizationModule(conf.canvasRootNode, conf.colors, conf.wavesNumber, conf.heightDifference);
		vis.initializeView();
		audio = AudioModule(conf.audioUrl);
		audio.initializeAudio();
		controls.playAudioNode.addEventListener('click', play, false);
		controls.pauseAudioNode.addEventListener ('click', pause, false);
		controls.audioFileNode.addEventListener ('change', onFileChange, false);
		controls.titleElement.innerHTML = conf.audioUrl.split('/').pop().split('.')[0];
	}

	return { initialize }
}

export default ControlsModule;
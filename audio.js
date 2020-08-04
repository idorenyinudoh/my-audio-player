const varz = {
    playAnimation: null,
    playIcon: document.getElementById('play-icon'),
    range: document.getElementById('range-input'),
    audio: document.querySelector('audio')
},
//playFocus and rangeFocus in one object
audioPlayerPresentation = {
    // so the focus state only shows on keyboard application, and not mouse for the play icon
    addPlayFocus() {
        if(document.activeElement === varz.playIcon && varz.playIcon.classList.contains('play-focus') === false) varz.playIcon.classList.add('play-focus');
    },
    removePlayFocus() {
        if(varz.playIcon.classList.contains('play-focus')) varz.playIcon.classList.remove('play-focus');
    },
    // so the focus state only shows on keyboard application, and not mouse for the range
    addRangeFocus() {
        if(document.activeElement === varz.range && varz.range.classList.contains('range-focus') === false) {
            varz.range.classList.add('range-focus');
            document.querySelector('div#range-container').classList.add('outline');
        }
    },
    removeRangeFocus() {
        if(varz.range.classList.contains('range-focus')) {
            varz.range.classList.remove('range-focus');
            document.querySelector('div#range-container').classList.remove('outline');
        }
    }
},
audioPlayerInteraction = {
    // HTMLHtmlElement
    root: document.querySelector('html'),
    // function for the whatever time of the audio player
    time(val) {
        let min = Math.floor(val / 60);
        let secsCalc = () => {
            let secs = val % 60;
            return secs < 10 ? `0${secs}` : `${secs}`;
        }
        return `${min}:${secsCalc()}`;
    },
    // function to set max attribute of range, show duration, and show buffered data on metadata load
    metadata: {
        forProgress() {
            if(varz.audio.duration > 0)audioPlayerInteraction.root.style.setProperty('--buffered-width', `${Math.floor(varz.audio.buffered.end(varz.audio.buffered.length - 1)) / varz.range.max * 100}%`);
        },
        main() {
            varz.range.max = Math.floor(varz.audio.duration);
            document.querySelector('#duration').textContent = audioPlayerInteraction.time(varz.range.max);
            this.forProgress();
        }
    },
    // function to be called on range input (and when the rAF is running)
    inputEvent() {
        document.querySelector('#current-time').textContent = audioPlayerInteraction.time(varz.range.value);
        audioPlayerInteraction.root.style.setProperty('--before-width', `${varz.range.value / varz.range.max * 100}%`);
    },
    // rAF for updating the current time and range value of the audio player
    updateCurrentTime() {
        varz.range.value = Math.floor(varz.audio.currentTime);
        audioPlayerInteraction.inputEvent();
        audioPlayerInteraction.rAF = requestAnimationFrame(audioPlayerInteraction.updateCurrentTime);
    },
    // object with methods for playing and stopping rAF
    controlRaf: {
        isPlayingRaf: false,
        play() {
            requestAnimationFrame(audioPlayerInteraction.updateCurrentTime);
            this.isPlayingRaf = true;
        },
        stop() {
            cancelAnimationFrame(audioPlayerInteraction.rAF);
            this.isPlayingRaf = false;
        }
    },
    // function to control playback
    controlPlayback: {
        isShowingPlay: true,
        playBack() {
            if(this.isShowingPlay) {
                varz.audio.play();
                playAnimation.playSegments([14, 28], true);
                varz.playIcon.setAttribute('aria-label', 'pause');
                audioPlayerInteraction.controlRaf.play();
                this.isShowingPlay = false;
            } else {
                if(!varz.audio.paused)varz.audio.pause();
                playAnimation.playSegments([0, 14], true);
                varz.playIcon.setAttribute('aria-label', 'play');
                audioPlayerInteraction.controlRaf.stop();
                this.isShowingPlay = true;
            }
        }
    }
};
// load the play animation asynchronously
(async () => {
    await bodymovin.loadAnimation;
    playAnimation = bodymovin.loadAnimation({
        container: varz.playIcon,
        path: 'data.json', //for production
        // path: 'http://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false
    });
    playAnimation.goToAndStop(14, true);
})();

// set max attribute of range, show duration, and show buffered data when the metadata of the audio has loaded
if(varz.audio.readyState > 0) audioPlayerInteraction.metadata.main(); else varz.audio.addEventListener('loadedmetadata', () => { audioPlayerInteraction.metadata.main();});

// control playbackkkkkkkk
varz.playIcon.addEventListener('click', () => {audioPlayerInteraction.controlPlayback.playBack();});

// show buffered data on audio load
varz.audio.addEventListener('progress', audioPlayerInteraction.metadata.forProgress);

// for addition and removal of focus state of play and range
varz.playIcon.addEventListener('keyup', audioPlayerPresentation.addPlayFocus);
varz.playIcon.addEventListener('blur', audioPlayerPresentation.removePlayFocus);
varz.playIcon.addEventListener('pointerdown', audioPlayerPresentation.removePlayFocus);
varz.range.addEventListener('keyup', audioPlayerPresentation.addRangeFocus);
varz.range.addEventListener('blur', audioPlayerPresentation.removeRangeFocus);
varz.range.addEventListener('pointerdown', audioPlayerPresentation.removeRangeFocus);
varz.range.addEventListener('input', () => {
    audioPlayerInteraction.controlRaf.stop();
    audioPlayerInteraction.inputEvent();
});
varz.range.addEventListener('change', () => {
    varz.audio.currentTime=varz.range.value;
    if(!varz.audio.paused)audioPlayerInteraction.controlRaf.play();
});
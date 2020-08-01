let playAnimation, rAF;
const playIcon = document.getElementById('play-icon'),
root = document.querySelector('html'),
range = document.getElementById('range-input'),
audio = document.querySelector('audio'),
// so the focus state only shows on keyboard application, and not mouse for the play icon
togglePlayFocus = {
    add() {
        if(document.activeElement === playIcon && playIcon.classList.contains('play-focus') === false) playIcon.classList.add('play-focus');
    },
    remove() {
        if(playIcon.classList.contains('play-focus')) playIcon.classList.remove('play-focus');
    }
},
// so the focus state only shows on keyboard application, and not mouse for the range 
toggleRangeFocus = {
    add() {
        if(document.activeElement === range && range.classList.contains('range-focus') === false) {
            range.classList.add('range-focus');
            document.querySelector('div#range-container').classList.add('outline');
        }
    },
    remove() {
        if(range.classList.contains('range-focus')) {
            range.classList.remove('range-focus');
            document.querySelector('div#range-container').classList.remove('outline');
        }
    }
},
// function for the whatever time of the audio player
time = (val) => {
    let min = Math.floor(val / 60);
    let secsCalc = () => {
        let secs = val % 60;
        return secs < 10 ? `0${secs}` : `${secs}`;
    }
    return `${min}:${secsCalc()}`;
},
// function to set max attribute of range, show duration, and show buffered data on metadata load
metadata = {
    forProgress() {
        if(audio.duration > 0)root.style.setProperty('--buffered-width', `${Math.floor(audio.buffered.end(audio.buffered.length - 1)) / range.max * 100}%`);
    },
    main() {
        range.max = Math.floor(audio.duration);
        document.querySelector('#duration').textContent = time(range.max);
        this.forProgress();
    }
},
// function to be called on range input (and when the rAF is running)
inputEvent = () => {
    document.querySelector('#current-time').textContent = time(range.value);
    root.style.setProperty('--before-width', `${range.value / range.max * 100}%`);
},
// rAF for updating the current time and range value of the audio player
updateCurrentTime = () => {
    range.value = Math.floor(audio.currentTime);
    inputEvent();
    rAF = requestAnimationFrame(updateCurrentTime);
},
// object with methods for playing and stopping rAF
controlRaf = {
    isPlayingRaf: false,
    play() {
        requestAnimationFrame(updateCurrentTime);
        this.isPlayingRaf = true;
    },
    stop() {
        cancelAnimationFrame(rAF);
        this.isPlayingRaf = false;
    }
},
// function to control playback
controlPlayback = {
    isShowingPlay: true,
    playBack() {
        if(this.isShowingPlay) {
            audio.play();
            playAnimation.playSegments([14, 28], true);
            playIcon.setAttribute('aria-label', 'pause');
            controlRaf.play();
            this.isShowingPlay = false;
        } else {
            audio.pause();
            playAnimation.playSegments([0, 14], true);
            playIcon.setAttribute('aria-label', 'play');
            controlRaf.stop();
            this.isShowingPlay = true;
        }
    }
};
// load the play animation asynchronously
(async () => {
    await bodymovin.loadAnimation;
    playAnimation = bodymovin.loadAnimation({
        container: playIcon,
        path: 'data.json', //for production
        // path: 'http://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false
    });
    playAnimation.goToAndStop(14, true);
})();

// (async () => {
//     await fetch(`${audio.src}`, {
//         method: 'GET',
//         headers: {
//             'Connection':'keep-alive',
//             'Accept':'audio/mpeg',
//         }
//     });
// })();

// set max attribute of range, show duration, and show buffered data when the metadata of the audio has loaded
if(audio.readyState > 0) metadata.main(); else audio.addEventListener('loadedmetadata', () => {metadata.main();});

// control playbackkkkkkkk
playIcon.addEventListener('click', () => {controlPlayback.playBack();});

// show buffered data on audio load
audio.addEventListener('progress', metadata.forProgress);

// playFocus we defined earlier
playIcon.addEventListener('keyup', togglePlayFocus.add);
playIcon.addEventListener('blur', togglePlayFocus.remove);
playIcon.addEventListener('pointerdown', togglePlayFocus.remove);
// rangeFocus we defined earlier
range.addEventListener('keyup', toggleRangeFocus.add);
range.addEventListener('blur', toggleRangeFocus.remove);
range.addEventListener('pointerdown', toggleRangeFocus.remove);
range.addEventListener('input', () => {
    controlRaf.stop();
    inputEvent();
});
range.addEventListener('change', () => {
    audio.currentTime = range.value;
    if (!audio.paused) controlRaf.play();
});
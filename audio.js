let playAnimation, isShowingPlay = true, rAF;
const playIcon = document.getElementById('play-icon'),
root = document.querySelector('html'),
range = document.getElementById('range-input'),
rangePops = document.querySelector('div#range-container'),
audio = document.querySelector('audio'),
currentTime = document.querySelector('#current-time'),
duration = document.querySelector('#duration'),
// so the focus state only shows on keyboard application, and not mouse for the play icon
togglePlayFocus = {
    add() {
        if(document.activeElement === playIcon && playIcon.classList.contains('play-focus') === false) {
            playIcon.classList.add('play-focus');
        }
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
            rangePops.classList.add('outline');
        }
    },
    remove() {
        if(range.classList.contains('range-focus')) {
            range.classList.remove('range-focus');
            rangePops.classList.remove('outline');
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
// rAF for updating the current time and range value of the audio player
updateCurrentTime = () => {
    range.value = Math.floor(audio.currentTime);
    currentTime.textContent = time(range.value);
    root.style.setProperty('--before-width', `${range.value / range.max * 100}%`);
    rAF = requestAnimationFrame(updateCurrentTime);
},
controlRaf = {
    isPlayingRaf: false,
    play() {
        requestAnimationFrame(updateCurrentTime);
        this.isPlayingRaf = true;
    },
    pause() {
        cancelAnimationFrame(rAF);
        this.isPlayingRaf = false;
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
    console.log(2);
})();

// set max attribute of range, show duration, and show buffered data when the metadata of the audio has loaded
if(audio.readyState > 0) {
    range.max = Math.floor(audio.duration);
    duration.textContent = time(range.max);
    root.style.setProperty('--buffered-width', `${Math.floor(audio.buffered.end(audio.buffered.length - 1)) / range.max * 100}%`);
} else {
    audio.addEventListener('loadedmetadata', () => {
        range.max = Math.floor(audio.duration);
        duration.textContent = time(range.max);
        root.style.setProperty('--buffered-width', `${Math.floor(audio.buffered.end(audio.buffered.length - 1)) / range.max * 100}%`);
    });
}

// control play and pause
playIcon.addEventListener('click', () => {
    if (isShowingPlay) {
        audio.play();
        playAnimation.playSegments([14, 28], true);
        playIcon.setAttribute('aria-label', 'pause');
        if (!isPlayingRaf) {
            requestAnimationFrame(updateCurrentTime);
            isPlayingRaf = true;
        }
        isShowingPlay = false;
    }
    else {
        audio.pause();
        playAnimation.playSegments([0, 14], true);
        playIcon.setAttribute('aria-label', 'play');
        if (isPlayingRaf) {
            cancelAnimationFrame(rAF);
            isPlayingRaf = false;
        }
        isShowingPlay = true;	
    }
});

// show buffered data on audio load
audio.addEventListener('progress', () => {
    root.style.setProperty('--buffered-width', `${Math.floor(audio.buffered.end(audio.buffered.length - 1)) / range.max * 100}%`);
});

// playFocus we defined earlier
playIcon.addEventListener('keyup', togglePlayFocus.add);
playIcon.addEventListener('blur', togglePlayFocus.remove);
playIcon.addEventListener('pointerdown', togglePlayFocus.remove);
// rangeFocus we defined earlier
range.addEventListener('keyup', toggleRangeFocus.add);
range.addEventListener('blur', toggleRangeFocus.remove);
range.addEventListener('pointerdown', toggleRangeFocus.remove);
range.addEventListener('input', () => {
    if (isPlayingRaf) {
        cancelAnimationFrame(rAF);
        isPlayingRaf = false;
    }
    root.style.setProperty('--before-width', `${range.value / range.max * 100}%`);
    currentTime.textContent = time(range.value);
});
range.addEventListener('change', () => {
    audio.currentTime = range.value;
    if (!isShowingPlay) {
        requestAnimationFrame(updateCurrentTime);
        isPlayingRaf = true;
    }
});
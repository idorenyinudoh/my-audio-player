let playAnimation, isShowingPlay = true, rAF, isPlayingRaf = false;
const playIcon = document.getElementById('play-icon');
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
// so the focus state only shows on keyboard application, and not mouse for the play icon
const togglePlayFocus = {
    add() {
        if(document.activeElement === playIcon && playIcon.classList.contains('play-focus') === false) {
            playIcon.classList.add('play-focus');
        }
    },
    remove() {
        if(playIcon.classList.contains('play-focus')) playIcon.classList.remove('play-focus');
    }
},
root = document.querySelector('html'),
range = document.getElementById('range-input'),
rangePops = document.querySelector('div#range-container'),
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
audio = document.querySelector('audio'),
currentTime = document.querySelector('#current-time'),
duration = document.querySelector('#duration'),
RangeDetails = {
    // current method for the current time of the audio player
    current() {
        let val = range.value;
        let min = Math.floor(val / 60);
        let secsCalc = () => {
            let secs = val % 60;
            return secs < 10 ? `0${secs}` : `${secs}`;
        }
        return `${min}:${secsCalc()}`;
    },
    // duration method for the duration time of the audio player
    duration() {
        let durationMinutes = Math.floor(audio.duration / 60),
        durationSeconds = () => {
            let secs = Math.floor(audio.duration - durationMinutes * 60);
            return secs < 10 ? `0${secs}` : secs;
        };
        return `${durationMinutes}:${durationSeconds()}`;
    }
},
// rAF for updating the current time and range value of the audio player
updateCurrentTime = () => {
    currentTime.textContent = RangeDetails.current();
    range.value = (Math.floor(audio.currentTime) / Math.floor(audio.duration)) * Math.floor(audio.duration);
    root.style.setProperty('--before-width', `${range.value / range.max * 100}%`);
    rAF = requestAnimationFrame(updateCurrentTime);
};

// set max attribute of range when the metadata of the audio has loaded
if(audio.readyState > 0) {
    range.max = Math.floor(audio.duration);
} else {
    audio.addEventListener('loadedmetadata', () => {
        range.max = Math.floor(audio.duration);
    });
}

// show duration when the audio canplay 
if(audio.readyState > 2) {
    duration.textContent = RangeDetails.duration();
} else {
    audio.addEventListener('canplay', () => {
        duration.textContent = RangeDetails.duration();
    });
}

// control play and pause
playIcon.addEventListener('click', () => {
    if (isShowingPlay) {
        audio.play();
        playAnimation.playSegments([14, 28], true);
        if (!isPlayingRaf) {
            requestAnimationFrame(updateCurrentTime);
            isPlayingRaf = true;
        }
        isShowingPlay = false;
    }
    else {
        audio.pause();
        playAnimation.playSegments([0, 14], true);
        if (isPlayingRaf) {
            cancelAnimationFrame(rAF);
            isPlayingRaf = false;
        }
        isShowingPlay = true;	
    }
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
    currentTime.textContent = RangeDetails.current();
});
range.addEventListener('change', () => {
    audio.currentTime = range.value;
    if (!isShowingPlay && !isPlayingRaf) {
        requestAnimationFrame(updateCurrentTime);
        isPlayingRaf = true;
    }
});
//Main purpose is for the webkit-range-progress to update when the range's value !== 0
// window.addEventListener('load', () => {
//     document.querySelector('html').style.setProperty('--before-width', `${(range.value)/2}vw`);
// });
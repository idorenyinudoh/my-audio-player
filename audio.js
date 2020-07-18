let playAnimation, isShowingPlay = true;
const playIcon = document.getElementById('play-icon');
(async () => {
    await bodymovin.loadAnimation;
    playAnimation = bodymovin.loadAnimation({
        container: playIcon,
        //path: 'data.json', //for production
        path: 'http://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false
    });
    playAnimation.goToAndStop(14, true);
    console.log(2);
})();
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
range = document.getElementById('range-input'),
rangePops = document.querySelector('div#range-container'),
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


playIcon.addEventListener('click', () => {
    if (isShowingPlay) {
        audio.play();
        playAnimation.playSegments([14, 28], true);
        isShowingPlay = false;
    }
    else {
        audio.pause();
        playAnimation.playSegments([0, 14], true);
        isShowingPlay = true;	
    }
});
playIcon.addEventListener('keyup', togglePlayFocus.add);
playIcon.addEventListener('blur', togglePlayFocus.remove);
playIcon.addEventListener('pointerdown', togglePlayFocus.remove);
range.addEventListener('keyup', toggleRangeFocus.add);
range.addEventListener('blur', toggleRangeFocus.remove);
range.addEventListener('pointerdown', toggleRangeFocus.remove);
range.addEventListener('input', () => {
    document.querySelector('html').style.setProperty('--before-width', `${range.value}%`);
});
//Main purpose is for the webkit-range-progress to update when the range's value !== 0
// window.addEventListener('load', () => {
//     document.querySelector('html').style.setProperty('--before-width', `${(range.value)/2}vw`);
// });
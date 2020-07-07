const range = document.getElementById('range-input'),
rangePops = document.querySelector('div#range-container'),
playIcon = document.getElementById('play-icon');


const playAnimation = bodymovin.loadAnimation({
    container: playIcon,
    path: 'http://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
    renderer: 'svg',
    loop: false,
    autoplay: false,
    name: "play",
});
playAnimation.goToAndStop(14, true);

let play = true;

playIcon.addEventListener('click', () => {
    if(playIcon.classList.contains('play-focus')) {
        playIcon.classList.remove('play-focus');
    }
    if (play) {
        playAnimation.playSegments([14, 28], true);
        play = false;
    }
    else {
        playAnimation.playSegments([0, 14], true);
        play = true;	
    }
});


playIcon.addEventListener('keyup', () => {
    if(document.activeElement === playIcon && playIcon.classList.contains('play-focus') === false) {
        playIcon.classList.add('play-focus');
    }
});
playIcon.addEventListener('blur', () => {
    if(playIcon.classList.contains('play-focus')) {
        playIcon.classList.remove('play-focus');
    }
});
range.addEventListener('keyup', () => {
    if(document.activeElement === range && range.classList.contains('range-focus') === false) {
        range.classList.add('range-focus');
        rangePops.classList.add('outline');
    }
});
range.addEventListener('blur', () => {
    if(range.classList.contains('range-focus')) {
        range.classList.remove('range-focus');
        rangePops.classList.remove('outline');
    }
});
range.addEventListener('pointerdown', () => {
    if(range.classList.contains('range-focus')) {
        range.classList.remove('range-focus');
        rangePops.classList.remove('outline');
    }
});
range.addEventListener('input', () => {
    document.querySelector('html').style.setProperty('--before-width', `${(range.value)/2}vw`);
});
//Main purpose is for the webkit-range-progress to update when the range's value !== 0
// window.addEventListener('load', () => {
//     document.querySelector('html').style.setProperty('--before-width', `${(range.value)/2}vw`);
// });
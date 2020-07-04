const range = document.getElementById('range-input'),
rangePops = document.querySelector('div#range-container');

range.addEventListener('keyup', () => {
    if(document.activeElement === range && range.classList.contains('focus') === false) {
        range.classList.add('focus');
    }
});
range.addEventListener('blur', () => {
    if(range.classList.contains('focus')) {
        range.classList.remove('focus');
    }
});
range.addEventListener('pointerdown', () => {
    if(range.classList.contains('focus')) {
        range.classList.remove('focus');
    }
});
range.addEventListener('input', () => {
    document.querySelector('html').style.setProperty('--before-width', `${(range.value)/2}vw`);
});
//Main purpose is for the webkit-range-progress to update when the range's value !== 0
// window.addEventListener('load', () => {
//     document.querySelector('html').style.setProperty('--before-width', `${(range.value)/2}vw`);
// });
const range = document.getElementById('range-input');

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
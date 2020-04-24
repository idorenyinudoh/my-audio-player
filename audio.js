$(function() {
    $player = $('#player');
    $playButton = $('#play');
    $pauseButton = $('#pause');

    $playButton.on('click', function(){
        player.play();
    });
    $pauseButton.on('click', function(){
        player.pause();
    });
});
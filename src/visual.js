"use strict";

var windowHeight = window.innerHeight,
    windowWidth = window.innerWidth;


function centerMusicCircle($musicCircle) {

    console.log("CHANGE");
    $musicCircle.css({top: windowHeight / 2 - $musicCircle.height() / 2 - MUSIC_CIRCLE_OFFSET,
        left: windowWidth / 2 - $musicCircle.width() / 2});

}

function placeAlbum($musicCircle, $albumCover, $showAlbum) {

    $albumCover.css({top: windowHeight / 2 - $musicCircle.height() / 2 -
    MUSIC_CIRCLE_OFFSET + ($musicCircle.height() - $albumCover.height()) / 2 + PROGRESS_CIRCLE_BORDER,
        left: windowWidth / 2 - $musicCircle.width() / 2 + ($musicCircle.width() - $albumCover.width()) / 2  + PROGRESS_CIRCLE_BORDER});
    $showAlbum.css({top: windowHeight / 2 - $musicCircle.height() / 2 -
    MUSIC_CIRCLE_OFFSET + ($musicCircle.height() - $showAlbum.height()) / 2 + PROGRESS_CIRCLE_BORDER,
        left: windowWidth / 2 - $musicCircle.width() / 2 + ($musicCircle.width() - $showAlbum.width()) / 2  + PROGRESS_CIRCLE_BORDER});

}

function placeBottomElement($rhythmCircle, $element) {
    $element.css({top: $rhythmCircle.height() + (windowHeight - $rhythmCircle.height()) / 2,
        left: windowWidth / 2 - $element.width() / 2});
}

function centerRhythmCircle($musicCircle) {
    var $rhythmCircle = $("div.musicCircle div.rhythmCircle");

    $rhythmCircle.css({top: ($musicCircle.height() - $rhythmCircle.height()) / 2,
        left: ($musicCircle.width() - $rhythmCircle.width()) / 2});
}


function animeBar($musicCircle, $animeBar) {
    $animeBar.css({top: $musicCircle.height() / 2 - $animeBar.height() / 2});

    var $animeName = $(".animeBar p.songTimer");

    $animeName.css({lineHeight: $animeBar.height() + "px"});
}

function playerComponent($playerDiv, $drawSvg) {
    var progress_start = $drawSvg.rect(PROGRESS_START_WIDTH, PROGRESS_START_HEIGHT).fill('white');
    var progress_circle = $drawSvg.circle(PROGRESS_CIRCLE_RADIUS*2).fill('#e1e1e1');

    var startRecPosnX = $drawSvg.width() / 2 - PROGRESS_START_WIDTH / 2;
    var progressCirclePosnX = $drawSvg.width() / 2;
    var progressCirclePosnY = PROGRESS_CIRCLE_RADIUS + (PROGRESS_START_HEIGHT - PROGRESS_CIRCLE_RADIUS*2)/2;

    $playerDiv.css({"top": -(PROGRESS_START_HEIGHT/2), "left": -(PROGRESS_CIRCLE_RADIUS*2)});

    progress_circle.cx(progressCirclePosnX).cy(progressCirclePosnY);
    progress_start.x(startRecPosnX).y(0);

    progress_circle.filter(function (add) {
        var blur = add.offset(0).gaussianBlur(2);
        add.blend(add.source, blur)
    });

    var $progressFilter = $("div.musicCircle div#playerControl").find("filter:first-child");

    $progressFilter[0].setAttribute("width", "200%");
    $progressFilter[0].setAttribute("height", "200%");
    $progressFilter[0].setAttribute("x", "-40%");
    $progressFilter[0].setAttribute("y", "-40%");
}

$(document).ready(function () {
    var $window = $(window),
        $musicCircle = $(".musicCircle").eq(0),
        $musicCircleBuffered = $("#musicCircleBuffered"),
        $musicCirclePlayed = $('#musicCirclePlayed'),
        $musicCirclePlayed2 = $('#musicCirclePlayed2'),
        $rhythmCircle = $(".rhythmCircle").eq(0),
        $background = $("#bg"),
        $showAlbum = $("#showAlbum"),
        $albumCover = $("#albumCover"),
        $animeBar = $(".animeBar").eq(0),
        $songInfo = $(".songInfo").eq(0),
        $playerDiv = $("#playerControl"),
        $functionIcons = $('#functionIcons'),
        $albumName = $("#albumName"),
        $volumeSlider = $('#volumeSlider');
    
    var audio = document.getElementById('song');

    var $drawSvg = SVG('playerControl')
        .size($musicCircle.width() + PROGRESS_CIRCLE_RADIUS * 4, $musicCircle.height() + PROGRESS_START_HEIGHT);

    centerMusicCircle($musicCircle);
    centerMusicCircle($musicCircleBuffered);
    centerMusicCircle($musicCirclePlayed);
    centerMusicCircle($musicCirclePlayed2);
    placeAlbum($musicCircle, $albumCover, $showAlbum);
    placeBottomElement($rhythmCircle, $albumName);
    placeBottomElement($rhythmCircle, $functionIcons);
    centerRhythmCircle($musicCircle);
    animeBar($musicCircle, $animeBar);
    playerComponent($playerDiv, $drawSvg);

    var $progressCircle = $('div#playerControl svg circle').eq(0);
    var player = new Player($progressCircle);
    var curSong = new Song('http://fm.h2o2.me/testMusic2.mp3');

    player.playedPartMask(0, $('.musicCirclePlayed'));
    player.playedPartMask(0, $musicCircleBuffered);

    player.setAudio(audio);
    player.setCurSong(curSong);

    $window.on('keydown', function(e) {
        switch(e.keyCode) {
            case 32:
                if (player.playerIsPaused()) {
                    player.playSong();
                    player.setPlayerPaused(false);
                } else {
                    player.pauseSong();
                    player.setPlayerPaused(true);
                }

                break;
            case 37:
                player.prevSong();
                break;
            case 39:
                player.nextSong();
                break;
            case 38:
                player.volumeUnitUp();
                break;
            case 40:
                player.volumeUnitDown();
                break;
            default:
                break;
        }
    });

    $volumeSlider.change(function () {
        player.setVolume(this.value / 100);
    });

    audio.addEventListener('progress', function () {
        var buffered = audio.buffered;

        if(buffered.length > 0 && audio.duration) player.playerAutoRotate(buffered.end(buffered.length - 1) / audio.duration, $musicCircleBuffered);
    });
    

    var transformData = ($drawSvg.width() / 2 + 1) + 'px' + ' ' + ($drawSvg.height() / 2 + 1) + 'px';

    function timeUpdateActions() {
        var buffered = audio.buffered;
        var duration = audio.duration;
        var curTime = audio.currentTime;

        if(duration) {
            if(!curSong._songDuration) {
                var globalTemp = new GlobalHelper();

                curSong._songDuration = duration;
                $('#totalTime').text(globalTemp.timeStyler(duration));
            }

            player.update(curTime, $progressCircle);

            if(buffered.length > 0) player.playerAutoRotate(buffered.end(buffered.length - 1) / audio.duration, $musicCircleBuffered);
        }
    }

    //console.log('transformData: ', transformData);
    //console.log($drawSvg.width(), $progressCircle.width());
    $progressCircle.css({'transform-origin': transformData});
    $progressCircle.on('mousedown', function (e) {
        $('body').on('mousemove', function (e) {
            audio.removeEventListener('timeupdate', timeUpdateActions);
            player.playerControlRotate($musicCircle, e.pageX, e.pageY, $progressCircle, $('.musicCirclePlayed'), timeUpdateActions);
        });
    });

    audio.addEventListener('timeupdate', timeUpdateActions);

    var timer;
    var albumDisplayed = false;

    $showAlbum.hover(function () {
        timer = setTimeout(function () {
            $background.delay(300).fadeTo(400, .1, "swing");
            $functionIcons.delay(300).fadeOut(100);
            $albumCover.show().delay(300).fadeTo(300, 1, "swing");
            $albumName.show().delay(300).fadeTo(400, 1, "swing");
            $songInfo.delay(300).fadeOut();
            albumDisplayed = true;
        }, 500);
    }, function () {
        if (albumDisplayed) {
            $background.delay(300).fadeTo(400, .5, "swing");
            $functionIcons.delay(300).fadeIn();
            $albumCover.delay(300).fadeTo(300, 0, "swing").hide(0);
            $albumName.delay(300).fadeTo(400, 0, "swing").hide(0);
            $songInfo.delay(200).fadeIn(100);
            albumDisplayed = false;
        } else {
            clearTimeout(timer);
        }

    });

    
    $window.resize(function () {
        windowHeight = $window.height();
        windowWidth = $window.width();
        centerMusicCircle($musicCircle);
        centerMusicCircle($musicCircleBuffered);
        centerMusicCircle($musicCirclePlayed);
        centerMusicCircle($musicCirclePlayed2);
        placeAlbum($musicCircle, $albumCover, $showAlbum);
        placeBottomElement($rhythmCircle, $albumName);
        placeBottomElement($rhythmCircle, $functionIcons);
        centerRhythmCircle($musicCircle);
        animeBar($musicCircle, $animeBar);

        $albumName.css({top: $rhythmCircle.height() + (windowHeight - $rhythmCircle.height()) / 2,
            left: windowWidth / 2 - $albumName.width() / 2});
    });
});



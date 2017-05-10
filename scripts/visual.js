"use strict";

var windowHeight = window.innerHeight,
    windowWidth = window.innerWidth;

$(document).ready(function () {
    var $window = $(window),
        $musicCircle = $(".musicCircle"),
        $rhythmCircle = $(".rhythmCircle"),
        $background = $("#bg"),
        $showAlbum = $("#showAlbum"),
        $albumCover = $("#albumCover"),
        $animeBar = $(".animeBar"),
        $songInfo = $(".songInfo"),
        $playerDiv = $("#playerControl"),
        $albumName = $("#albumName");

    var $drawSvg = SVG('playerControl')
        .size($musicCircle.width() + PROGRESS_CIRCLE_RADIUS * 4, $musicCircle.height() + PROGRESS_START_HEIGHT);

    centerMusicCircle($musicCircle, $albumCover, $showAlbum);
    animeBar($musicCircle, $animeBar);
    playerControl($playerDiv, $drawSvg);

    $showAlbum.hover(function () {
        $background.delay(300).fadeTo(400, .1, "swing");
        $albumCover.show().delay(300).fadeTo(300, 1, "swing");
        $albumName.show().delay(300).fadeTo(400, 1, "swing");
        $songInfo.delay(300).fadeOut();
    }, function () {
        $background.delay(300).fadeTo(400, .5, "swing");
        $albumCover.delay(300).fadeTo(300, 0, "swing").hide(0);
        $albumName.delay(300).fadeTo(400, 0, "swing").hide(0);
        $songInfo.delay(200).fadeIn();
    });

    $albumName.css({top: $rhythmCircle.height() + (windowHeight - $rhythmCircle.height()) / 2,
        left: windowWidth / 2 - $albumName.width() / 2});

    $window.resize(function () {
        windowHeight = $window.height();
        windowWidth = $window.width();
        centerMusicCircle($musicCircle, $albumCover, $showAlbum);
        animeBar($musicCircle, $animeBar);

        $albumName.css({top: $rhythmCircle.height() + (windowHeight - $rhythmCircle.height()) / 2,
            left: windowWidth / 2 - $albumName.width() / 2});
    })

});

function centerMusicCircle($musicCircle, $albumCover, $showAlbum) {
    console.log("CHANGE");
    $musicCircle.css({top: windowHeight / 2 - $musicCircle.height() / 2 - MUSIC_CIRCLE_OFFSET,
        left: windowWidth / 2 - $musicCircle.width() / 2});
    $albumCover.css({top: windowHeight / 2 - $musicCircle.height() / 2 -
                        MUSIC_CIRCLE_OFFSET + ($musicCircle.height() - $albumCover.height()) / 2 + PROGRESS_CIRCLE_BORDER,
        left: windowWidth / 2 - $musicCircle.width() / 2 + ($musicCircle.width() - $albumCover.width()) / 2  + PROGRESS_CIRCLE_BORDER});
    $showAlbum.css({top: windowHeight / 2 - $musicCircle.height() / 2 -
    MUSIC_CIRCLE_OFFSET + ($musicCircle.height() - $showAlbum.height()) / 2 + PROGRESS_CIRCLE_BORDER,
        left: windowWidth / 2 - $musicCircle.width() / 2 + ($musicCircle.width() - $showAlbum.width()) / 2  + PROGRESS_CIRCLE_BORDER});

    var $rhythmCircle = $("div.musicCircle div.rhythmCircle");

    $rhythmCircle.css({top: ($musicCircle.height() - $rhythmCircle.height()) / 2,
        left: ($musicCircle.width() - $rhythmCircle.width()) / 2});


}

function animeBar($musicCircle, $animeBar) {
    $animeBar.css({top: $musicCircle.height() / 2 - $animeBar.height() / 2});

    var $animeName = $(".animeBar p.songTimer");

    $animeName.css({lineHeight: $animeBar.height() + "px"});
}

function playerControl($playerDiv, $drawSvg) {
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

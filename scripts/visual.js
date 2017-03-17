"use strict";

var windowHeight = window.innerHeight,
    windowWidth = window.innerWidth;

$(document).ready(function () {
    var $window = $(window),
        $musicCircle = $(".musicCircle"),
        $animeBar = $(".animeBar");

    centerMusicCircle($musicCircle);
    animeBar($musicCircle, $animeBar);

    $window.resize(function () {
        windowHeight = $window.height();
        windowWidth = $window.width();
        centerMusicCircle($musicCircle);
        //animeBar($musicCircle, $animeBar);
    })


});

function centerMusicCircle($musicCircle) {
    $musicCircle.css({top: windowHeight / 2 - $musicCircle.height() / 2 - MUSIC_CIRCLE_OFFSET,
        left: windowWidth / 2 - $musicCircle.width() / 2});

    var $rhythmCircle = $("div.musicCircle div.rhythmCircle");

    $rhythmCircle.css({top: ($musicCircle.height() - $rhythmCircle.height()) / 2,
        left: ($musicCircle.width() - $rhythmCircle.width()) / 2});
}

function animeBar($musicCircle, $animeBar) {
    $animeBar.css({top: $musicCircle.height() / 2 - $animeBar.height() / 2});

    var $animeName = $(".animeBar p.animeName");

    $animeName.css({lineHeight: $animeBar.height() + "px"});
    if ($animeName.text().length > 10) {
        $animeName.css({fontSize: 2 + "rem", letterSpacing: 0})
    } else if ($animeName.text().length < 5) {
        $animeName.css({letterSpacing: 1 + "rem"})
    }
}


/**
 * Created by H2O2 on 17/6/17.
 */

function Player($progressCircle) {
    "use strict";

    var _curSong = null;
    var _curVolume = 0.8;
    var _volumeBeforeMute = 0.8;
    var _isMute = false;
    var _playerPaused = false;
    var _curSongPlayed = 0;
    var $volumeSlider = $('#volumeSlider');
    var $volumeIcon = $('#volumeIcon');

    this.audio = null;
    this.globalHelper = new GlobalHelper();
    this.prevX = 0;
    this.prevDegree = 0;
    this.initX = $progressCircle.offset().left;
    this.initY = $progressCircle.offset().top;
    this.curSongBufferedPercent = 0;
    this.curTime = 0;
    this.progressCircleDragged = false;

    this.playerIsPaused = function () {
        return _playerPaused;
    };
    this.setPlayerPaused = function (paused) {
        _playerPaused = paused;
    };

    this.setCurSong = function (song) {
        _curSong = song;
        this.audio.src = _curSong._songSrc;
    };

    this.setVolume = function (volume) {
        if(!volume && volume !== 0) volume = _curVolume;

        this.audio.volume = volume;
        _curVolume = volume;
        volumeSlider.value = _curVolume * 100;
        this.toggleVolumeIcon();

        volumeSlider.focus();
    };

    this.volumeUnitUp = function (volChange = DEFAULT_VOLUME_CHANGE) {
        _curVolume += volChange;

        if (_curVolume > 1) _curVolume = 1;

        volumeSlider.value = _curVolume * 100;
    };

    this.volumeUnitDown = function (volChange = DEFAULT_VOLUME_CHANGE) {
        _curVolume -= volChange;

        if (_curVolume <= 0) {
            _curVolume = 0;
            this.toggleVolumeIcon();
        }

        volumeSlider.value = _curVolume * 100;
    };

    this.toggleMute = function() {
        if (_isMute) {
            this.setVolume(_volumeBeforeMute);
            _isMute = false;
        } else {
            _volumeBeforeMute = _curVolume;
            this.setVolume(0);
            _isMute = true;
        }
    }

    this.toggleVolumeIcon = function () {
        if (_curVolume > 0) $volumeIcon.addClass('fa-volume-up').removeClass('fa-volume-off');
        else $volumeIcon.removeClass('fa-volume-up').addClass('fa-volume-off');
    }

    this.update = function (time, controller) {
        var playedPercent = time / _curSong._songDuration;

        this.curTime = time;
        controller.css({'transform': 'rotate(' + 360 * playedPercent + 'deg)'});
        this.playerAutoRotate(playedPercent, $('.musicCirclePlayed'));
        this.printTime(time);
    }
}

Player.prototype.setAudio = function(audio) {
    this.audio = audio;
    this.setVolume();
    this.toggleVolumeIcon(); // toggle the volume icon back
};

Player.prototype.playSong = function () {
    this.audio.play();
};

Player.prototype.pauseSong = function () {
    this.audio.pause();
};

Player.prototype.nextSong = function () {
    //TODO
};

Player.prototype.prevSong = function () {
    //TODO
};

Player.prototype.playerAutoRotate = function (percentage, mask) {
    this.playedPartMask(360 * percentage, mask);
}

Player.prototype.playerControlRotate = function (refElement, x, y, control, mask, timeUpdateActions) {
    var posnX = x - refElement.offset().left - refElement.width() / 2,
        posnY = -(y - refElement.offset().top - refElement.height() / 2);

    var rotateDegree = 90 - (Math.atan2(posnY, posnX) * (180/Math.PI));
    var timeAfterDrag;

    if (rotateDegree < 0) rotateDegree = 90 + rotateDegree + 270;

    control.css({'transform': 'rotate(' + rotateDegree + 'deg)'});
    timeAfterDrag = this.audio.duration * (rotateDegree / 360);
    this.printTime(timeAfterDrag);

    this.playedPartMask(rotateDegree, mask);
    $this = $(this);
    $('body').on('mouseup', function (e) {
        if ($(e.target).is('#volumeControl') || $(e.target).is('#bg') || $(e.target).is('#showAlbum')) return;

        $('body').unbind('mousemove');
        $this[0].audio.addEventListener('timeupdate', timeUpdateActions);
        $this[0].audio.currentTime = timeAfterDrag;
    });
};


// Reference: http://www.jianshu.com/p/bc94380c4a22
Player.prototype.playedPartMask = function (rotateDegree, mask) {

    var test = Math.tan(Math.PI / 10) / 2 * 100 + 50;
    var rotateDegreeRadian = rotateDegree * Math.PI / 180;

    var maskingStr = 'polygon(50% 50%,50% 0%,';
    var mask2 = maskingStr + "100% 0%,";
    var mask3 = mask2 + "100% 100%,";
    var mask4 = mask3 + "0% 100%,";
    var mask5 = mask4 + "0% 0%,";

    var rawPercentage;

    if (rotateDegree <= 45) {
        rawPercentage = Math.tan(this.globalHelper.degreeToRadian(rotateDegree)) / 2 * 100 + 50;
        mask.css({'clip-path': maskingStr + rawPercentage + '% 0%)'});
    } else if (rotateDegree <= 90) {
        rawPercentage = (1 - Math.tan(this.globalHelper.degreeToRadian(90 - rotateDegree))) / 2 * 100;
        mask.css({'clip-path': mask2 + '100%' + rawPercentage + '%'});
    } else if (rotateDegree <= 135) {
        rawPercentage = Math.tan(this.globalHelper.degreeToRadian(rotateDegree - 90)) / 2 * 100 + 50;
        mask.css({'clip-path': mask2 + '100%' + rawPercentage + '%'});
    } else if (rotateDegree <= 180) {
        rawPercentage = 100 - (1 - Math.tan(this.globalHelper.degreeToRadian(45 - (rotateDegree - 135)))) / 2 * 100;
        mask.css({'clip-path': mask3 + rawPercentage + '% 100%'});
    } else if (rotateDegree <= 225) {
        rawPercentage = 100 - (Math.tan(this.globalHelper.degreeToRadian(rotateDegree - 180)) / 2 * 100 + 50);
        mask.css({'clip-path': mask3 + rawPercentage + '% 100%'});
    } else if (rotateDegree <= 270) {
        rawPercentage = 100 - (1 - Math.tan(this.globalHelper.degreeToRadian(45 - (rotateDegree - 225)))) / 2 * 100;
        mask.css({'clip-path': mask4 + '0% ' + rawPercentage + '%'});
    } else if (rotateDegree <= 315) {
        rawPercentage = 100 - (Math.tan(this.globalHelper.degreeToRadian(rotateDegree - 270)) / 2 * 100 + 50);
        mask.css({'clip-path': mask4 + '0% ' + rawPercentage + '%'});
    } else if (rotateDegree <= 360) {
        rawPercentage = (1 - Math.tan(this.globalHelper.degreeToRadian(45 - (rotateDegree - 315)))) / 2 * 100
        mask.css({'clip-path': mask5 + rawPercentage + '% 0%)'});
    }
};

Player.prototype.printTime = function(time) {
    $('#currentTime').text(this.globalHelper.timeStyler(time));
}


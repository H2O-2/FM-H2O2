/**
 * Created by H2O2 on 17/6/17.
 */

function Player() {
    "use strict";

    this.globalHelper = new GlobalHelper();

}

Player.prototype.playSong = function () {
    //TODO
};

Player.prototype.pauseSong = function () {
    //TODO
};

Player.prototype.nextSong = function () {
    //TODO
};

Player.prototype.prevSong = function () {
    //TODO
};

Player.prototype.playerControlRotate = function (refElement, x, y, control) {
    var posnX = x - refElement.offset().left - refElement.width() / 2,
        posnY = -(y - refElement.offset().top - refElement.height() / 2);

    var rotateDegree = 90 - (Math.atan2(posnY, posnX) * (180/Math.PI));

    if (rotateDegree < 0) rotateDegree = 90 + rotateDegree + 270;

    var rotatePercent = rotateDegree / 360 * 100;
    console.log('rotateDegree', rotateDegree);

    control.css({'transform': 'rotate(' + rotateDegree + 'deg)'});
    this.playedPartMask(rotateDegree);
    $('body').on('mouseup', function (e) {
        $('body').unbind('mousemove');
    });
};


// Reference: http://www.jianshu.com/p/bc94380c4a22
Player.prototype.playedPartMask = function (rotateDegree) {

    var test = Math.tan(Math.PI / 10) / 2 * 100 + 50;
    var rotateDegreeRadian = rotateDegree * Math.PI / 180;

    var mask = $('.musicCirclePlayed');
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
    } else if (rotateDegree < 360) {
        rawPercentage = (1 - Math.tan(this.globalHelper.degreeToRadian(45 - (rotateDegree - 315)))) / 2 * 100
        mask.css({'clip-path': mask5 + rawPercentage + '% 0%)'});
    }
};


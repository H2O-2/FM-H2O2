/**
 * Created by H2O2 on 17/6/18.
 */

function GlobalHelper() {}

GlobalHelper.prototype.degreeToRadian = function (degree) {
    return degree * Math.PI / 180;
};

// convert time in seconds to form of mm:ss, return a string
GlobalHelper.prototype.timeStyler = function (time) {

    function styler(time) {
        return time < 10 ? '0' + time : time;
    }

    return styler(parseInt(time / 60)) + ':' + styler(parseInt(time % 60));
}



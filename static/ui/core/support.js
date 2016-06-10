/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-04-15 11:39:15
 * @description  Support.js 相关支持判断
 */



(function(undefined) {
    var $ = require('zepto');

    require('./detect');

    var br = $.browser;

    $.support = $.extend($.support || {}, {
        orientation: !(br.uc || (parseFloat($.os.version) < 5 && (br.qq || br.chrome))) && !($.os.android && parseFloat($.os.version) > 3) && "orientation" in window && "onorientationchange" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        has3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        pushState: "pushState" in history && "replaceState" in history,
        requestAnimationFrame: 'webkitRequestAnimationFrame' in window
    });

})();

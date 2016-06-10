var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    fmui.define('Countup', {

        /**
         * @property {Number}  startVal       开始值
         * @property {Number}  endVal         结束值
         * @property {String}  decimals       小数点位数
         * @property {Number}  duration       动画持续时间
         * @property {Boolean} useEasing      toggle easing
         * @property {Boolean} useGrouping    1,000,000 vs 1000000
         * @property {String}  separator      character to use as a separator
         * @property {String}  decimal        character to use as a decimal
         */
        options: {
            startVal: 0,
            endVal: 0,
            decimals: 0,
            duration: 2,
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.'
        },
        /**
         * @初始化化
         * @private
         */
        _init: function() {
            var 
                me = this,
                opts = me._options,
                $el = me.getEl(),
                lastTime = 0,
                vendors = ['webkit', 'moz', 'ms', 'o'];

            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame =
                  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                      timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                }
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                }
            }

            if (opts.separator == '') opts.useGrouping = false;
            if (opts.prefix == null) opts.prefix = '';
            if (opts.suffix == null) opts.suffix = '';

            
            opts.startVal = Number(opts.startVal);
            opts.endVal = Number(opts.endVal);
            opts.countDown = (opts.startVal > opts.endVal) ? true : false;
            opts.startTime = null;
            opts.timestamp = null;
            opts.remaining = null;
            opts.frameVal = opts.startVal;
            opts.rAF = null;
            opts.decimals = Math.max(0, opts.decimals || 0);
            opts.dec = Math.pow(10, opts.decimals);
            opts.duration = opts.duration * 1000 || 2000;


            me.printValue(opts.startVal);
        },

        /**
         * 设置显示的值
         * @method printValue
         * @property {Number} value 
         * @public
         *
         */
        printValue: function(value) {
            var 
                me = this,
                opts = me._options,
                $el = me.getEl(),
                result = (!isNaN(value)) ? me.formatNumber(value) : '00';

            if ($el[0].tagName == 'INPUT') {
                $el.val(result);
            } 
            else if ($el[0].tagName == 'text') {
                $el.text(result);
            }
            else {
                $el.html(result);
            }
        },

        /**
         * Robert Penner's easeOutExpo
         * @param  {[Number]} t [description]
         * @param  {[Number]} b [description]
         * @param  {[Number]} c [description]
         * @param  {[Number]} d [description]
         * @return {[Number]}   中间显示值
         */
        easeOutExpo: function(t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        },

        /**
         * [count description]
         * @param  {[type]} timestamp requestAnimationFrame回调参数
         */
        count: function() {

            var me = this;

            return function(timestamp) {
                var 
                    opts = me._options,
                    $el = me.getEl(),
                    progress;

                if (opts.startTime === null) opts.startTime = timestamp;

                opts.timestamp = timestamp;
                progress = timestamp - opts.startTime;
                opts.remaining = opts.duration - progress;
                // to ease or not to ease
                if (opts.useEasing) {
                    if (opts.countDown) {
                        var i = me.easeOutExpo(progress, 0, opts.startVal - opts.endVal, opts.duration);
                        opts.frameVal = opts.startVal - i;
                    } else {
                        opts.frameVal = me.easeOutExpo(progress, opts.startVal, opts.endVal - opts.startVal, opts.duration);
                    }
                } else {
                    if (opts.countDown) {
                        var i = (opts.startVal - opts.endVal) * (progress / opts.duration);
                        opts.frameVal = opts.startVal - i;
                    } else {
                        opts.frameVal = opts.startVal + (opts.endVal - opts.startVal) * (progress / opts.duration);
                    }
                }

                // don't go past endVal since progress can exceed duration in the last frame
                if (opts.countDown) {
                    opts.frameVal = (opts.frameVal < opts.endVal) ? opts.endVal : opts.frameVal;
                } else {
                    opts.frameVal = (opts.frameVal > opts.endVal) ? opts.endVal : opts.frameVal;
                }

                // decimal
                opts.frameVal = Math.round(opts.frameVal*opts.dec)/opts.dec;

                // format and print value
                me.printValue(opts.frameVal);
                       
                // whether to continue
                if (progress < opts.duration) {
                    opts.rAF = requestAnimationFrame(me.count());
                } else {
                    if (opts.callback != null) opts.callback();
                }
            }
        },
        /**
         * 开始执行动画
         * @param  {Function} callback 回调函数
         */
        start: function(callback) {
            var 
                me = this,
                opts = me._options,
                $el = me.getEl();

            opts.callback = callback;
            // make sure values are valid
            if (!isNaN(opts.endVal) && !isNaN(opts.startVal)) {
                opts.rAF = requestAnimationFrame(me.count());
            } else {
                console.log('countUp error: startVal or endVal is not a number');
                me.printValue();
            }
            return false;
        },

        /**
         * 停止动画
         */
        stop: function() {
            cancelAnimationFrame(this._options.rAF);
        },

        /**
         * 重置动画
         */
        reset: function() {
            var opts = this._options;
            opts.startTime = null;
            cancelAnimationFrame(opts.rAF);
            this.printValue(opts.startVal);
        },

        /**
         * [resume description]
         */
        resume: function() {
            var me = this,
                opts = me._options;
            me.stop();
            opts.startTime = null;
            opts.duration = opts.remaining;
            opts.startVal = opts.frameVal;
            requestAnimationFrame(me.count());
        },

        /**
         * 更新设置
         * @param  {[type]} newEndval [description]
         */
        update: function (newEndval) {
            var me = this,
                opts = this._options;

            me.stop();
            opts.startTime = null;
            opts.startVal = opts.endVal;
            opts.endVal = Number(newEndval);
            opts.countDown = (opts.startVal > opts.endVal) ? true : false;
            opts.rAF = requestAnimationFrame(me.count());
        },

        /**
         * [formatNumber description]
         * @param  {[type]} nStr [description]
         * @return {[type]}      [description]
         */
        formatNumber: function(nStr) {
            var me = this,
                opts = me._options;

            nStr = nStr.toFixed(opts.decimals);
            nStr += '';
            var x, x1, x2, rgx;
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? opts.decimal + x[1] : '';
            rgx = /(\d+)(\d{3})/;
            if (opts.useGrouping) {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + opts.separator + '$2');
                }
            }
            return opts.prefix + x1 + x2 + opts.suffix;
        }

    });

})(fmui, fmui.$, undefined);
/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-25 15:13:49
 * @description  Countdown 倒计时组件
 * @module       Countdown
 *
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    fmui.define('Countdown', {
        /**
         * @property {Number} endTime    截止Unix时间戳，单位毫秒
         * @property {Number} leftTime   剩余时间，单位秒，建议使用服务器端时间，比较准确
         * @property {String} template   显示模板，默认hms,可配置${d}天${h}时${m}分${s}秒
         * @property {RegExp} varRegular 正则表达式，用来替换模板占位符
         * @property {Array}  clock      时钟属性，用来处理时间数据
         * @property {String} effect     默认，normal，后期可以扩展
         */
        options: {
            endTime: 0,

            leftTime: 0,

            template: '${h}时${m}分${s}秒',

            varRegular: /\$\{([\-\w]+)\}/g,

            clock: ['d', 100, 2, 'h', 24, 2, 'm', 60, 2, 's', 60, 2],

            effect: 'normal'
        },

        Effect: {
            normal: {
                paint: function () {
                    var me = this,
                        content;

                    // 找到值发生改变的hand
                    $.each(me.hands, function (index, hand) {
                        if (hand.lastValue !== hand.value) {
                            content = '';

                            $.each(me._toDigitals(hand.value, hand.bits), function (index, digital) {
                                content += me._html(digital, '', 'digital');
                            });

                            // 更新DOM
                            hand.node.html(content);
                        }
                    });
                }
            }
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                opts = me._options,
                el = me.getEl();

            /**
             * 指针结构
             * hand: {
             *   type: string, // d,h,m,s
             *   value: number, // 当前值
             *   lastValue: number,
             *   base: number,
             *   radix: number,
             *   bits: number,
             *   node: $node
             * }
             */
            var hands = [];
            me.hands = hands;

            // 分析和解析template
            var tmpl = opts.template,
                regstr = opts.varRegular;

            // 初始化hands type
            el.html(tmpl.replace(regstr, function(str, type) {
                hands.push({
                    type: type
                });

                return me._html('', type, 'hand');
            }));

            var clock = opts.clock;
            /**
             * hand 的node, radix, bits等属性初始化.
             * console.log(hand);
             * Object {type: "d", node: Z[1], base: 86400000, radix: 100, bits: 2}
             * Object {type: "h", node: Z[1], base: 3600000, radix: 24, bits: 2}
             * Object {type: "m", node: Z[1], base: 60000, radix: 60, bits: 2}
             * Object {type: "s", node: Z[1], base: 1000, radix: 60, bits: 2}
             *
             */
            $.each(hands, function(index, hand) {
                var type = hand.type,
                    base = 1000,
                    i;

                hand.node = el.find('.hand-' + type);

                // radix, bits 初始化.
                for (i = clock.length - 3; i > -1; i -= 3) {
                    if (type === clock[i]) {
                        break;
                    }

                    base *= clock[i + 1];
                }

                hand.base = base;

                hand.radix = clock[i + 1];

                hand.bits = clock[i + 2];
            });

            me._getLeft();

            me._reflow();
        },

        /**
         * 获取倒计时剩余时间
         * @private
         */
        _getLeft: function() {
            var me = this,
                opts = me._options,

                left = opts.leftTime * 1000,

                end = opts.endTime; // 这个是UNIX时间戳，毫秒级

            if (!left && end) {
                left = end - Date.now();
            }

            me.left = left; // 毫秒数
        },

        /**
         * 更新绘制时钟
         * @private
         */
        _reflow: function() {
            var me = this;

            // Object {type: "h", node: Z[1], base: 3600000, radix: 24, bits: 2}
            // 更新hands
            $.each(me.hands, function(index, hand) {
                hand.lastValue = hand.value;
                hand.value = Math.floor(me.left / hand.base) % hand.radix;
            });

            // 重绘时钟
            me._repaint();

            me.left -= 1000;

            // 临界处理
            if(me.left < 0) {
                clearTimeout(me.timeout);

                delete me.timeout;

                return me.trigger('complete');
            }

            me.timeout = setTimeout(function() {
                me._reflow();
            }, 1000);

            return me;
        },

        /**
         * 重绘时钟
         * @private
         */
        _repaint: function() {
            this.Effect[this._options.effect].paint.apply(this);
        },

        /**
         * 把值转换为独立的数字形式
         * @private
         * @param {number} value
         * @param {number} bits
         */
        _toDigitals: function(value, bits) {
            value = value < 0 ? 0 : value;

            var digitals = [];

            // 把时、分、秒等换算成数字.
            while (bits--) {
                digitals[bits] = value % 10;

                value = Math.floor(value / 10);
            }

            return digitals;
        },

        /**
         * 生成需要的html代码，辅助工具
         * @private
         * @param {string} content 
         * @param {string} className
         * @param {string} type
         */
        _html: function(content, className, type) {
            switch (type) {
                case 'hand':
                    className = type + ' hand-' + className;
                    break;
                case 'digital':
                    className = type + ' ' + type + '-' + content + ' ' + className;
                    break;
            }

            return '<span class="' + className + '">' + content + '</span>';
        }

        /**
         * @event complete
         * @param {Event} e fmui.Event对象
         * @description 倒计时结束时触发
         */
    });

})(fmui, fmui.$);
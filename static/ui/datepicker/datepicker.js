/**
 *
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-21 17:22:19
 * @description  Form Validate 组件
 * @module       Validate
 */


var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {

    fmui.define('Datepicker', {
        /**
         * @property {Object}   [current]    [当前时间]
         * @property {Array}    [weeks]      [周文本]
         * @property {Array}    [between]    [日期区间，单位毫秒]
         * @property {String}   [position]   [日期面板位置]
         * @property {Number}   [deltaX]     [日起面板水平偏移量]
         * @property {Number}   [deltaY]     [日起面板垂直偏移量]
         */
        options: {
            current: new Date(),
            weeks: ["日", "一", "二", "三", "四", "五", "六"],
            between: [0, new Date().getTime()],
            splitchar: '-',
            position: 'bottom',
            deltaX: 0,
            deltaY: 0,
            onSelect: noop,
            onShow: noop,
            onHide: noop,
            onDestroy: noop
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                opts = me._options,
                current = opts.current = opts.current || new Date();

            opts.year  = current.getFullYear();
            opts.month = current.getMonth() + 1;
            opts.day   = current.getDate();


            me.tmplFun = __inline('./_datepicker.tmpl')


            // 初始化值
            me.setValue();

            $el.off('.datepicker').on('click.datepicker', function(e) {
                var val = this.value,   
                    $datepicker = $('div.datepicker');

                $datepicker.length  && $datepicker.hide();

                if(me.$template) {
                    me.validate(val) && me.show().setValue(val)._update();
                }else {
                    me.$template.appendTo('body');
                    me.show();
                    me._update();
                    me._bindEvents();
                    me._position();
                }
                e.stopPropagation();
            });
        },

        /**
         * @private
         */
        _bindEvents: function() {
            var me = this,
                opts = me.options,
                $template = me.$template,
                _setMonth = function(delta) {
                    opts.month += delta;
                    if(opts.month > 12) {
                        opts.year ++;
                        opts.month = 1;
                    }else if(opts.month < 1) {
                        opts.year --;
                        opts.month = 12;
                    }
                    me._update();
                },
                eventObj = {
                    prevMonth: function() {
                        _setMonth(-1);
                    },
                    nextMonth: function() {
                        _setMonth(1);
                    },
                    day: function(obj) {
                        var $this = obj,
                            year,month;

                        if($this.hasClass('disabled')) return;

                        year = $this.data('year');
                        month = $this.data('month');
                        opts.day = $this.text();

                        if(year != opts.year || month != opts.month) {
                            opts.year = year;
                            opts.month = month;
                        }
                        opts.onSelect.call(me, opts.year, opts.month, opts.day);
                        me.setValue();
                    }
                };

            $template.on('click', function(event) {
                var $this = $(event.target),
                    action = $this.data('action');

                if(!action) {
                    $this = $this.closest('td');
                    action = $this.data('action');
                }
                eventObj[action] && eventObj[action].call($this[0], $this);
                return false;
            });
        },

        /**
         * @private
         */
        _position: function() {
            var me = this,
                opts = me.options,
                $template = me.$template,
                tmp_w = $template.outerWidth(),
                tmp_h = $template.outerHeight(),
                $el = me.$el,
                el_w = $el.outerWidth(),
                el_h = $el.outerHeight(),
                offset = $el.offset(),
                deltaX = opts.deltaX,
                deltaY = opts.deltaY,
                left,top;

            switch(opts.position) {
                case 'left':
                    left = deltaX + offset.left - el_w;
                    top = deltaY + offset.top;
                    break;
                case 'right':
                    left = deltaX + offset.left + el_w;
                    top = deltaY + offset.top;
                    break;
                case 'top':
                    left = deltaX + offset.left;
                    top = deltaY + offset.top - tmp_h;
                    break;
                case 'bottom':
                    left = deltaX + offset.left;
                    top = deltaY + offset.top + el_h;
            }

            $template.css({
                position: 'absolute',
                left: left,
                top: top
            })
        },

        /**
         * @private
         */
        _update: function() {
            var me = this,
                cache = me.cache,
                _y = cache.year,
                _m = cache.month,
                _d = cache.day,
                opts = me.options,
                year = opts.year,
                month = opts.month,
                weeks = opts.weeks,
                days = me._getDays(year, month);
                html = [],
                $template = me.$template,
                currentTime = (function() {
                    var d = new Date();
                    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
                })();

            html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
            html.push('<tbody>');

            // week title
            html.push('<tr>');
            for(var i = 0, ilen = weeks.length; i < ilen; i ++) {
                html.push('<th>'+ weeks[i] +'</th>');
            }
            html.push('</tr>');

            // week day
            for(var i = 0, ilen = days.length; i < ilen; i ++) {
                var week = days[i];
                html.push('<tr>');
                for(var j = 0, jlen = week.length; j < jlen; j++) {
                    var date = week[j],
                        classArr = ['datepicker-cell'],
                        selectedTime = new Date(date.y, date.m - 1, date.d).getTime(),
                        current = selectedTime === currentTime,
                        selected = _y == date.y && _m == date.m && _d == date.d,
                        disabled = selectedTime < opts.between[0] || selectedTime > opts.between[1];

                    date.s = date.s || 'current-month';
                    classArr.push(date.s);
                    current && classArr.push('current');
                    selected && classArr.push('selected');
                    disabled && classArr.push('disabled');

                    html.push('<td data-year="'+ date.y +'" data-month="'+ date.m +'" data-day="'+ date.d +'" data-action="day" class="'+ classArr.join(' ') +'" >'+ ( date.s == 'current-month' ? ('<a href="javascript:void(0)">' + date.d + '</a>') : date.d )+'</td>');
                }
                html.push('</tr>');
            }
            html.push('</tbody>');

            if($template && $template.length) {
                $template.find('.datepicker-year').html(year);
                $template.find('.datepicker-month').html(me._prefix(month));
                $template.find('.datepicker-body').html(html.join('\n'));
                me.options.onSelect.call(me);
            }
            return me;
        },

        /**
         * @private
         */
        _getDays: function(year, month) {
            var days = [],
                week = [],
                lastday = new Date(year, month, 0).getDate();

            for(var i = 1; i <= lastday; i ++) {
                var day = new Date(year, month - 1, i).getDay();
                week.push({
                    y: year,
                    m: month,
                    d: i,
                    w: day
                });

                if(day == 6) {
                    days.push(week);
                    week = [];
                }
            }

            week.length && days.push(week);

            var firstweek = days[0],
                firstday = firstweek[0],
                firstweeklen = firstweek.length,
                getFirstWeek = function(firstweeklen) {
                    var week = [];
                    for(var i = 1; i <= 7 - firstweeklen; i++) {
                        var date = new Date(firstday.y, firstday.m - 1, firstday.d - i);
                        week.unshift({
                            y: date.getFullYear(),
                            m: date.getMonth() + 1,
                            d: date.getDate(),
                            w: date.getDay(),
                            s: 'prev-month'
                        });
                    }
                    return week;
                };

            if(firstweeklen < 7) {
                days[0] = getFirstWeek(firstweeklen).concat(firstweek);
            }else {
                days.unshift(getFirstWeek(0));
            }

            var lastweek = days[days.length - 1],
                lastweeklen = lastweek.length,
                getLastWeek = function(lastweeklen) {
                    var week = [],
                        lastweekday = lastweek[lastweek.length - 1];

                    for(var i = 1; i <= 7 - lastweeklen; i++) {
                        var date = new Date(lastweekday.y, lastweekday.m - 1, lastweekday.d + i);
                        week.push({
                            y: date.getFullYear(),
                            m: date.getMonth() + 1,
                            d: date.getDate(),
                            w: date.getDay(),
                            s: 'next-month'
                        });
                    }
                    return week;
                };

            if(lastweeklen < 7) {
                lastweek = days[days.length - 1] = lastweek.concat(getLastWeek(lastweeklen));
            }

            if(days.length < 6) {
                days.push(getLastWeek(0));
            }

            return days;
        },

        _prefix: function(value) {
            return value < 10 ? '0' + value : value;
        },

        /**
         * @public
         * @method setValue
         * @param {String} date [日志，eg: 2016-10-11]
         * @description 设置日期
         */
        setValue: function(date) {
            var me = this,
                opts = me.options,
                cache = me.cache;

            if('string' === typeof date) {
                var date = new Date(date);
                opts.year = date.getFullYear();
                opts.month = date.getMonth() + 1;
                opts.day = date.getDate();
            }

            cache.year  = opts.year;
            cache.month = opts.month;
            cache.day   = opts.day;
            me.el.value = [me._prefix(opts.year), me._prefix(opts.month), me._prefix(opts.day)].join(opts.splitchar);
            return me;
        },

        /**
         * @public
         * @method getValue
         * @description 获取当前选中日期
         * @return {Object} [Date Object]
         */
        getValue: function() {
            return this.el.value;
        },

        /**
         * @public
         * @method show
         * @description 隐藏panel
         * @return {Self} [description]
         */
        show: function() {
            var me = this;
            me.$template && me.$template.show();

            $('body').off('.datepicker').on('click.datepicker', function() {
                me.hide();
            });
            me.options.onShow.call(me);
            return me;
        },

        /**
         * @public
         * @method hide
         * @description 隐藏panel
         * @return {Self} [description]
         */
        hide: function() {
            var me = this;
            me.$template && me.$template.hide();
            me.options.onHide.call(me);
            return me;
        },

        /**
         * @public
         * @method reset
         * @description 重置
         * @return {Self} [description]
         */
        reset: function() {
            var me = this,
                opts = me.options,
                current = opts.current;

            opts.year = current.getFullYear();
            opts.month = current.getMonth() + 1;
            opts.day = current.getDate();

            me.setValue();
            return me;
        },

        /**
         * @public
         * @method validate
         * @description 日期合法性校验
         * @return {Boolean} [description]
         */
        validate: function(date) {
            var opts = this.options,
                splitchar = opts.splitchar;
                regArr = ['^(\\d{4})', '(0[1-9]|1[1-2])', '(0[1-9]|[1-2]\\d|3[0-1])$'],
                res = new RegExp(regArr.join(splitchar)).exec(date),
                res = res && res[3] <= new Date(res[1], res[2], 0).getDate();

            return res;
        }
    });
})(fmui, fmui.$);


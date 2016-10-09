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
    fmui.define('Datetime', {
        /**
         *
         */
        options: {
            /* datepicker */
            editable: true,
            current: new Date(),
            dateFormat: function(y, m, d) {
                return y + '-' + m + '-' + d;
            },

            /* position */
            position: 'bottom left',
            offset: 12,

            /* timepicker */
            timepicker: false,
            dateTimeSeparator: ' ',
            timeFormat: '',
            minHour: 0,
            maxHour: 24,
            minMinute: 0,
            maxMinute: 59,
            hourStep: 1,
            minuteStep: 1,

            /* events */
            onSelect: noop,
            onShow: noop,
            onHide: noop,
            onDestory: noop
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

            var $template = $('<div class="sgui-datetime">' +
                '<div class="sgui-datetime-header">'+
                    '<input type="button" value="<" class="datetime-prev-year">'+
                    '<input type="button" value="<" class="datetime-prev-month">'+
                    '<span class="datetime-year"></span>年'+
                    '<span class="datetime-month"></span>月'+
                    '<input type="button" value=">" class="datetime-next-month">'+
                    '<input type="button" value=">" class="datetime-next-year">'+
                '</div>'+
                '<div class="sgui-datetime-body"></div>');

            me.$template = $template;

            me.setValue();

            $('body').append($template);

            $template.on('click', 'input.datetime-prev-month', function(event) {
                me.setMonth(-1);
            }).on('click', 'input.datetime-next-month', function() {
                me.setMonth(1);
            }).on('click', 'input.datetime-prev-year', function() {
                me.setYear(-1);
            }).on('click', 'input.datetime-next-year', function() {
                me.setYear(1);
            }).on('click', '.datetime-cell', function() {
                var $this = $(this),
                    year = $this.attr('data-year'),
                    month = $this.attr('data-month');

                opts.day = $this.text();
                if(year != opts.year || month != opts.month) {
                    opts.year = year;
                    opts.month = month;
                }
                me.setValue();

            });
        },


        _update: function() {
            var me = this,
                opts = me.options,
                year = opts.year,
                month = opts.month,
                weeks = me.getWeeks(year, month);
                html = [],
                $template = me.$template;

            html.push('<table>');
            html.push('<thead><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></thead>');
            html.push('<tbody>');

            for(var i = 0, ilen = weeks.length; i < ilen; i ++) {
                var week = weeks[i];
                html.push('<tr class="datetime-tr">');

                for(var j = 0, jlen = week.length; j < jlen; j++) {
                    var date = week[j],
                        current = opts.month == date.m && opts.day == date.d ? 'current': '';

                    html.push('<td class="datetime-cell '+ current +' '+ (date.s || '') +'" data-year="'+ date.y +'" data-month="'+ date.m +'" data-day="'+ date.d +'">'+ date.d +'</td>');
                }
                html.push('<tr>');
            }
            html.push('</tbody>');

            $template.find('.datetime-year').html(opts.year);
            $template.find('.datetime-month').html(opts.month);
            $template.find('.sgui-datetime-body').html(html.join('\n'));
            me.options.onSelect.call(me);
            return me;
        },

        setYear: function(delta) {
            var me = this,
                opts = me.options;

            opts.year += delta;
            me.setValue();
            return me;
        },

        setMonth: function(delta) {
            var me = this,
                opts = me.options;

            opts.month += delta;
            if(opts.month > 12) {
                opts.year ++;
                opts.month = 1;
            }else if(opts.month < 1) {
                opts.year --;
                opts.month = 12;
            }
            me.setValue();
            return me;
        },

        setValue: function(date) {
            var me = this,
                opts = me.options,
                date, year, month, day;

            try{
                if('string' === typeof date) {
                    var date = new Date(date);
                    opts.year = date.getFullYear();
                    opts.month = date.getMonth() + 1;
                    opts.day = date.getDate();
                }
            }catch(e) {}

            var value = 'function' === typeof opts.dateFormat ? opts.dateFormat(opts.year, opts.month, opts.day) : '';

            me.$el.val(value);
            me._update();
            return me;
        },

        getValue: function() {
            var opts = this.options;
            return new Date(opts.year, opts.month, opts.day);
        },

        getWeeks: function(year, month) {
            var weeks = [],
                week = [],
                days = [],
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
                    weeks.push(week);
                    week = [];
                }
            }

            week.length && weeks.push(week);

            var firstweek = weeks[0],
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
                            s: 'other'
                        });
                    }
                    return week;
                };

            if(firstweeklen < 7) {
                weeks[0] = getFirstWeek(firstweeklen).concat(firstweek);
            }else {
                weeks.unshift(getFirstWeek(0));
            }

            var lastweek = weeks[weeks.length - 1],
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
                            s: 'other'
                        });
                    }
                    return week;
                };

            if(lastweeklen < 7) {
                lastweek = weeks[weeks.length - 1] = lastweek.concat(getLastWeek(lastweeklen));
            }

            if(weeks.length < 6) {
                weeks.push(getLastWeek(0));
            }

            return weeks;
        },

        show: function() {
            var me = this;
            me.$template.show();
            me.options.onShow.call(me);
            return me;
        },

        hide: function() {
            var me = this;
            me.$template.hide();
            me.options.onHide.call(me);
            return me;
        },

        destroy: function() {
            var me = this;
            me.$template.remove();
            me.options.onDestory.call(me);
            return me;
        },

        reset: function() {
            var me = this,
                opts = me.options,
                current = opts.current;

            opts.year = current.getFullYear();
            opts.month = current.getMonth() + 1;
            opts.day = current.getDate();
            return me;
        }
    });
})(fmui, fmui.$);


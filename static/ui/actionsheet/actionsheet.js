/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-04-14 13:22:54
 * @description  ActionSheet 上拉列表组件
 */

var fmui = require('/static/ui/core/fmui');

require('/static/ui/overlay/overlay');

(function(fmui, $, undefined) {
    fmui.define('ActionSheet', {
        isNotShared: true,

        /**
         * 使用触发初始化建议使用click事件绑定元素触发
         * 
         * @property {Object} items 按钮键值对
         * ```
         * {
         *     '选项一': function(){}, 
         *     '选项二': function(){}
         * }
         * ```
         */
        options: {
            'items': null
        },

        /**
         * 创建DOM
         * @private
         */
        _create: function() {
            var me = this,
                opts = me._options,
                tmplFun = __inline('./_actionsheet.tmpl'),
                $tmpl = me._$tmpl = $(tmplFun({
                    items: opts.items || {}
                })),
                _overlay = me._overlay = $.overlay({display: false});

            $('body').append($tmpl);

            // add 取消 callback
            opts.items['取消'] = function() {
                me.hide();
            };

            _overlay.getEl().on('click', function() {
                me.hide();
            });

            $tmpl.off().on('click', '[data-actionsheet]', function() {
                var type = $(this).data('actionsheet');
                opts.items[type] && opts.items[type].call(this, me);
            });
        },

        /**
         * 显示上拉列表组件
         * @method destroy
         * @public
         * @return {Self}
         */
        show: function() {
            var me = this;
            me._overlay.show();
            me._$tmpl.addClass('fm-actionsheet-toggle');
        },
        
        /**
         * 隐藏上拉列表组件
         * @method hide
         * @public
         * @return {Self}
         */
        hide: function() {
            var me = this;
                $tmpl = me._$tmpl;

            me._overlay.hide();

            $tmpl.removeClass('fm-actionsheet-toggle');
            if($.support.cssTransitions) {
                $tmpl.on('transitionend webkitTransitionEnd', function() {
                    me.trigger('hide');
                })
            }else {
                me.trigger('hide')
            }
        },

        /**
         * 销毁上拉列表组件
         * @method destroy
         * @public
         * @return {Self}
         */
        destroy: function() {
            var me = this;

            me._$tmpl.off().remove();

            me._overlay.destroy();

            return me.$super('destroy');
        }

        /**
         *
         * @event show
         * @param {Event} e fmui.Event对象
         * @description 上拉列表显示时触发
         *
         * @event show
         * @param {Event} e fmui.Event对象
         * @description 上拉列表隐藏时触发
         * 
         * @event destroy
         * @param {Event} e fmui.Event对象
         * @description 上拉列表销毁时触发
         */
    });
})(fmui, fmui.$);
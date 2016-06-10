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
         * @property {Object} items {'选项一': function(){}, '选项二': function(){}}
         */
        options: {
            'items': {}
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                opts = me._options,
                tmplFun = __inline('./_actionsheet.tmpl');

            me._$tmpl = $(tmplFun({
                items: opts.items || {}
            }));
        },

        /**
         * 创建DOM
         * @private
         */
        _create: function() {
            var me = this,
                opts = me._options,
                $tmpl = me._$tmpl,
                _handler = function() {
                    $.support.cssTransitions ?
                    $tmpl.on('transitionend webkitTransitionEnd', function() {
                        me.destroy();
                    }).removeClass('fm-actionsheet-toggle') :
                    me.destroy();
                };

            // 创建弹窗
            var _overlay = me._overlay = $.overlay();

            $('body').append(me._$tmpl);

            // reflow
            $tmpl[0].clientLeft;

            // 添加动画类
            $tmpl.addClass('fm-actionsheet-toggle');

            // add 取消 callback
            opts.items['取消'] = function() {
                _handler();
            };

            // Overlay 绑定事件
            _overlay.getEl().on('click', function() {
                _handler();
            });

            $tmpl.on('click', '[data-actionsheet]', function() {
                var type = $(this).data('actionsheet');
                opts.items[type] && opts.items[type].call(this, me);
            });
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
         * @event destroy
         * @param {Event} e fmui.Event对象
         * @description 上拉列表销毁时触发
         */
    });
})(fmui, fmui.$);
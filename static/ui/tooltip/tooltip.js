/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-23 14:08:29
 * @description  Tooltip
 */


var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    fmui.define('Tooltip', {
        _init: function() {
            this._tooltipTmplFun = __inline('./_tooltip.tmpl');
        },

        /**
         * 显示表单校验错误提示
         * @method show
         * @public
         * @param  {Object} ele 当前对象
         * @param  {String} msg 提示信息
         * @return this
         */
        show: function(msg) {
            var me = this,
                $el = me.getEl(),
                $tooltipTmpl, $item,$clear,$arrow,_tmplFun;

            if( me.has() ) return;

            me._$tooltipTmpl = $tooltipTmpl = $(me._tooltipTmplFun({msg: msg}));
            me._$item = $item = $el.closest('.fm-list-item');

            $clear = $item.find('.fm-list-clear');
            $arrow = $tooltipTmpl.find('.fm-tooltip-arrow');

            $item.append($tooltipTmpl);

            $arrow.css({
                left: $clear.length ? ($clear.offset().left + $clear.width() / 2 - $arrow.width() / 2 ) : $item.width() / 2
            });

            me._timeout = setTimeout(function() {
                me.destroy();
            }, 3000);
        },

        /**
         * 销毁表单错误提示
         * @method destroy
         * @public
         * @return this
         */
        destroy: function() {
            var me = this,
                $tooltipTmpl = me._$tooltipTmpl,
                $item  = me._$item;

            $tooltipTmpl && $tooltipTmpl.remove();

            clearTimeout(me._timeout);

            me._$tooltipTmpl = me._timeout = null;

            return this.$super('destroy');
        },

        /**
         * 是否有错误提示
         * @method has
         * @public
         * @return {Boolean} true or false
         */
        has: function() {
            return !!this._$tooltipTmpl;
        }
    });
})(fmui, fmui.$);

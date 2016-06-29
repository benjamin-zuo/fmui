/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-23 16:22:10
 * @description  Toast 插件
 * @module       Toast
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    
    require('/static/ui/overlay/overlay');

    var tmplFun = __inline('./_toast.tmpl');

    fmui.define('Toast', {
        isNotShared: true,

        /**
         * @property {String}    content    字符串及HTML DOM
         * @property {Boolean}   modal      是否显示遮罩
         * @property {String}    type       icon 类型，默认none
         * @property {Number}    duration   动画延迟时常
         * @property {Boolean}   autoClose  是否自动关闭，默认true
         */
        options: {
            content: '',

            modal: true,

            type: 'none',

            duration: 2500,

            autoClose: true
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                opts = me._options,
                _map = {
                    success : '提交成功',
                    fail    : '提交失败',
                    loading : '处理中',
                    network : '网络无法连接',
                    none: '---------'
                };
            
            me.on('ready', function() {
                opts.content = opts.content || _map[opts.type];

                var _tmpl = $( tmplFun(opts) );

                me._overlay = opts.modal ? $.overlay({opacity: 0}) : null;

                $('body').append(_tmpl);

                'none' === opts.type && _tmpl.addClass('fm-toast-only-content');

                me._tmpl = _tmpl;

                if(!opts.autoClose) return;

                setTimeout(function() {
                    me.destroy();
                }, opts.duration);
            });
        },

        /**
         * 销毁组件
         * @method destroy
         * @public
         * @return this
         */
        destroy: function() {
            this._overlay && this._overlay.destroy();

            this._tmpl.remove();

            return this.$super('destroy');
        }
    }); 

})(fmui, fmui.$);


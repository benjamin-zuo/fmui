/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-24 14:04:21
 * @file         Dialog组件
 * @external     ui/overlay/overlay.js, ./dialog.tmpl
 * @module       Dialog
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    
    require('/static/ui/overlay/overlay');

    var tmplFun = __inline('./_dialog.tmpl');

    fmui.define('Dialog', {
        /**
         * @property {Object}  buttons 按钮键值对key:文本，value:handler
         * @property {Boolean} modal   是否显示遮罩层，默认：true
         * @property {String}  content 弹窗内容，可以为字符串和html代码片段
         * @property {String}  title   弹窗标题
         * @property {Boolean} disableScroll 弹窗打开时是否禁止页面滚动，默认：true
         */
        options: {
            buttons: null,

            modal: true,

            title: null,

            content: null,

            disableScroll: true // 待处理
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
            
                opts = me._options,

                $tmpl;

            $tmpl = me._tmpl = $(tmplFun(opts));

            // 创建overlay
            me._overlay = opts.modal && $.overlay();

            // 初始化按钮
            me._initBtn();

            $tmpl.appendTo( $('body') );
        },

        /**
         * 初始化话按钮
         * @private
         */
        _initBtn: function() {
            var me = this,
                buttons = me._options.buttons,
                html = [], $footer;

            if(Object.keys && !Object.keys(buttons).length) return;

            $footer = me._footer = me._tmpl.find('.fm-dialog-footer');

            // 此处使用foreach更新
            for(key in buttons) {
                if(buttons.hasOwnProperty(key)) {
                    html.push('<button type="button" class="fm-dialog-button">'+key+'</button>');
                }
            }

            $footer.html(html.join('\n')).on('tap', '.fm-dialog-button', function() {
                var key = $(this).text();

                buttons[key] && buttons[key].call(this, me);
            }) ;
        },

        /**
         * 显示弹窗
         * @method show
         * @public
         * @return this
         */
        show: function() {
            this._overlay && this._overlay.show();

            this._tmpl.show();
            
            return this.trigger('show');
        },

        /**
         * 隐藏弹窗
         * @return this
         */
        hide: function() {
            this._overlay && this._overlay.hide();

            this._tmpl.hide();

            return this.trigger('hide');   
        },

        /**
         * 销毁弹窗
         * @return this
         */
        destroy: function() {
            this._overlay && this._overlay.destroy();

            this._footer && this._footer.off();

            this._tmpl.remove();

            return this.$super('destroy');    
        }


        /**
         * @event show
         * @param {Event} e fmui.Event对象
         * @description 弹窗显示时触发
         */
        
        /**
         * @event hide
         * @param {Event} e fmui.Event对象
         * @description 弹窗隐藏时触发
         */

        /**
         * @event destroy
         * @param {Event} e fmui.Event对象
         * @description 弹窗销毁时触发
         */
    });

})(fmui, fmui.$);
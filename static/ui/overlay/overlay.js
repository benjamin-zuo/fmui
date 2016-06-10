/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-24 10:48:43
 * @description  Overlay 遮罩层
 * @module       Overlay
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {

    fmui.define('Overlay', {
        isNotShared: true,
        /**
         * @property {Number}    opacity  遮罩层透明度
         */
        options: {
            opacity: 0.6
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this;

            me.on('ready', function() {
                var $div = $('<div class="fm-overlay"></div>').css('opacity', me._options.opacity);

                $('body').append($div);

                me._$div = $div; 
            });
        },

        /**
         * 显示遮罩层
         * @method show
         * @public
         * @return this
         */
        show: function() {
            this._$div.show();
            return this.trigger('show');
        },

        /**
         * 隐藏遮罩层
         * @method  hide
         * @public
         * @return this
         */
        hide: function() {
            this._$div.hide();
            return this.trigger('hide');
        },

        /**
         * 获取遮罩层zepto DOM
         * @method getEl
         * @public
         * @return $div
         */
        getEl: function() {
            return this._$div;
        },

        /**
         * 销毁遮罩层
         * @method destroy
         * @public
         * @return this
         */
        destroy: function() {
            this._$div.off().remove();

            return this.$super('destroy');
        }

        /**
         * @event show
         * @param {Event} e fmui.Event对象
         * @description 遮罩层显示时触发
         */
        
        /**
         * @event hide
         * @param {Event} e fmui.Event对象
         * @description 遮罩层隐藏时触发
         */

        /**
         * @event destroy
         * @param {Event} e fmui.Event对象
         * @description 遮罩层销毁时触发
         */
    });

})(fmui, fmui.$);



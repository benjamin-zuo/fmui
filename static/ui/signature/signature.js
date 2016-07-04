/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-24 14:04:21
 * @file         Signature 电子签名组件
 * @external     ./_signature.tmpl
 * @module       Dialog
 */

var fmui = require('/static/ui/core/fmui');
var SignaturePad = require('/static/ui/signature/signature-pad');

(function(fmui, $, undefined) {
    fmui.define('Signature', {
        nonInstance: true,
        /**
         * @property {Object}    
         * ```
         * buttons: [{
                text: '重新签名',
                className: 'fm-button white',
                handler: function(me){
                    me._signatureObj.clear();
                }
            }, {
                text: '完成签名',
                className: 'fm-button orange',
                handler: function(me){
                    if(me._signatureObj.isEmpty()) {
                        alert('签名不能为空');
                    }
                }
            }]
            ```
         * @property {Boolean}   fixed   是否蒙层展示，默认：true
         * @property {Function}  handler  [description]
         */
        options: {
            buttons: null,

            signatureOptions: {
                backgroundColor: '#fff'
            }
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                opts = me._options,
                tmplFun = __inline('./_signature.tmpl'),
                $tmpl;

            $tmpl = me._tmpl = $(tmplFun(opts));

            $('body').css('overflow', 'hidden').append($tmpl);

            // 初始化按钮
            me._initBtn();

            // 初始化布局
            me._initLayout();

            // 初始化示例
            me._initSignatureExample();
        },

        /**
         * 初始化按钮
         * @private
         */
        _initBtn: function() {
            var me = this,
                opts = me._options,
                buttons = opts.buttons,
                html = [], $footer;

            if(!$.isArray(buttons)) return;

            me._footer = $footer = me._tmpl.find('.fm-signature-footer');

            buttons.forEach(function(obj, index) {
                html.push('<button type="button" class="'+ obj.className +'">'+ obj.text +'</button>');    
            });

            $footer.html(html.join('\n')).on('click', 'button', function() {
                var key = $(this).text(),
                    filtered = buttons.filter(function(obj) {
                        return key === obj.text;
                    });

                filtered.length && filtered[0]['handler'] && filtered[0]['handler'].call(this, me);
            }) ;
        },

        /**
         * 初始化布局
         * @private
         */
        _initLayout: function() {
            // 计算视口宽高
            var me          = this,
                $win        = $(window),
                $tmpl       = me._tmpl,
                $canvaswrap = $tmpl.find('.fm-signature-canvas'),
                $canvas     = $canvaswrap.find('canvas'),
                canvas      = $canvas[0],
                winW        = me.winW = $win.width(),
                winH        = me.winH = $win.height(),
                canvasW,canvasH;

            canvasW = winW - parseFloat($canvaswrap.css('padding-left')) * 2; // 处理画笔偏移问题
            canvasH = winH - $tmpl.find('.fm-signature-footer').height() - parseFloat($canvaswrap.css('padding-top')) * 2 ;

            $canvas.width(canvasW);
            $canvas.height(canvasH);

            canvas.width = canvasW;
            canvas.height = canvasH;

            me._signatureObj = new SignaturePad(canvas, me._options.signatureOptions);
        },

        /**
         * 初始化布局
         * @private
         */
        _initSignatureExample: function() {
            var me = this,
                _imgSrc = __inline('./name_v.png'),
                _tmplFun = __inline('./_signature-example.tmpl'),
                $tmpl = $(_tmplFun({
                    src: _imgSrc
                }));
            
            $('body').append($tmpl);

            $tmpl.height(me.winH).on('click', function(e) {
                $tmpl.animate({
                    opacity: 0,
                    translate3d: '0,'+ me.winH +'px ,0'
                }, 600, 'ease-out', function() {
                    $tmpl.off().remove();
                });
            });
        },

        /**
         * 获取签名对象实例
         * @return signatureObj
         */
        getSignature: function() {
            return me._signatureObj;
        },

        /**
         * 销毁弹窗
         * @return this
         */
        destroy: function() {
            this._footer.off();
            this._tmpl.remove();

            return this.$super('destroy');    
        }

        /**
         * @event destroy
         * @param {Event} e fmui.Event对象
         * @description 弹窗销毁时触发
         */
    });

})(fmui, fmui.$);
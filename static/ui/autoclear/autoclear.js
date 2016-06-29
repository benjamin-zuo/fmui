/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-24 10:48:43
 * @description  autoclear 表单input清除
 * @module       autoclear
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {

    var className = 'fm-input-autoclear',
        handler = {
            input: function(closest) {
                var $this = $(this),
                    val = this.value,
                    type = this.type;

                // 按语义性，应使用max而非maxlength
                switch(type) {
                    case 'number': 
                        var maxLen = parseInt($this.attr('maxlength'));
                        maxLen && val.length > maxLen && $this.val(val.substr(0, maxLen));
                        break;
                }

                closest && closest[val ? 'addClass' : 'removeClass'](className);
            },
            blur: function(closest) {
                closest && closest.removeClass(className);
            },
            focus: function(closest) {
                if($(this).prop('readonly')) return;

                closest && closest.addClass(className);
            }
        };

    // 此处处理autoclear + 手机号 + 信用卡号分隔处理
    $(document).on('input.autoclear blur.autoclear focus.autoclear', 'input', function(ev) {
        handler[ev.type] && handler[ev.type].call(this, $(this).closest('.fm-list-item'));   
    }).on('tap', '.fm-list-clear', function() {
        var $this = $(this),
            $item = $this.closest('.fm-list-item'),
            $input = $item.find('.fm-list-control').find('input');
            
        if($input.length) {
            $input.val('');
            'function' === typeof $input.validate && $input.validate('removeError');
            'function' === typeof $input.tooltip  && $input.tooltip('destroy');
        }
    });
})(fmui, fmui.$);



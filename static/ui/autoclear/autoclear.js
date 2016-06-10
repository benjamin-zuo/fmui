/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-24 10:48:43
 * @description  Autoclear 表单input清除
 * @module       Autoclear
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {

    var className = 'fm-input-autoclear',
        handler = {
            input: function(clear) {
                var val = this.value,
                    type = this.type;

                clear && clear[val ? 'addClass' : 'removeClass'](className);
            },
            blur: function(clear) {
                clear && clear.removeClass(className);
            },
            focus: function(clear) {
                clear && clear.addClass(className);
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



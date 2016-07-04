/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-06-07 14:06:35
 * @description  combobox 组件
 */


var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    $('body').on('change', 'select', function() {
        $(this).addClass('selected');
    });

    /* select 初始化选中 */
    $('select').each(function() {
        var $this = $(this),
            val = $this.data('value');

        val !== '' && val !== undefined && ($this.val(val), $this.trigger('change') );
    });
})(fmui, fmui.$);

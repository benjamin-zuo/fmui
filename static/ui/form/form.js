/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-21 17:03:51
 * @description  Form组件
 * @module       Form
 */

var fmui = require('/static/ui/core/fmui');
    require('/static/ui/validate/validate');

(function(fmui, $, undefined) {
    fmui.define('Form', {
        options: {

        },
        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                $el = this.getEl();

            $el.attr('novalidate', 'novalidate');
        },

        /**
         * 表单字段校验
         * @method validate
         * @public
         * @return {Boolean} true or false
         */
        validate: function() {
            var me = this,
                $el = this.getEl(),
                supportValidate = !!$.fn.validate,
                params = $el.serializeArray(),
                param, name, value, type, required, $ele,
                flag = true,
                i = 0,
                ilen = params.length;

            for (; i < ilen; i++) {
                param = params[i];
                name = param.name;
                $ele = $el.find('[name=' + name + ']');

                if (!$ele.length || !supportValidate) continue;
                type = $ele[0].type;

                switch (type) {
                    case 'select-one':
                    case 'select-multiple':
                        if(!$ele.prop('required') || $ele.prop('disabled') ) {
                            continue;
                        }else {
                            if( $.trim(param.value) ) {
                                continue;
                            }else {
                                $ele.addClass('fm-validate-red').closest('.fm-list-item').addClass('fm-validate');

                                // 绑定事件
                                $ele.on('change', function() {
                                    var $t = $(this);
                                    $t.val() && $t.off().removeClass('fm-validate-red').closest('.fm-list-item').removeClass('fm-validate');
                                });

                                flag = false;
                            }
                        }
                        break;
                    case 'hidden':
                    case 'text':
                    case 'password':
                    case 'tel':
                    case 'number':
                        if ($ele.validate && $ele.validate('isValid')) {
                            continue;
                        } else {
                            flag = false;
                        }
                        break;
                }
            }

            return flag;
        }
    });

})(fmui, fmui.$);



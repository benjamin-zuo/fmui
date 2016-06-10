/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-21 17:22:19
 * @description  Form Validate 组件
 * @module       Validate
 */


var fmui = require('/static/ui/core/fmui');
    require('/static/ui/tooltip/tooltip');

(function(fmui, $, undefined) {
    fmui.define('Validate', {
        /**
         * @property {Boolean}        required       是否必填项
         * @property {String|Array}   validType      校验类型
         * @property {String}         message        必填项提示信息
         * @property {Object}         rules          默认校验规则，可扩展
         */
        options: {
            required: false,

            validType: null,

            message: "该字段不能为空",

            rules: {
                tel: {
                    validator: function(value, param) {
                        return /^(?:13|14|15|17|18)\d{9}$/.test(value);
                    },
                    message: '请填写正确的手机号'
                },
                sms: {
                    validator: function(value, param) {
                        return new RegExp('^\\d{' + param[0] + '}$').test(value);
                    },
                    message: '请填写{0}位短信验证码'
                }
            }
        },

        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me  = this,
                $el = me.getEl(),
                $item;

            me._$item = $item = $el.closest('.fm-list-item');

            me.on('ready', function() {
                $el.on('input.validate blur.validate', function(e) {
                    me._eventName = e.type;
                    me._validate();
                }).on('focus.validate', function() {
                    if($item.hasClass('fm-validate')) {
                        $el.tooltip('show', me._errormsg);
                    }
                });
            })   
        },

        /**
         * 执行校验
         * @private
         */
        _validate: function() {
            var me = this,

                $el = me.getEl(),

                $item = me._$item,

                opts, val, validType,

                _doValid = function(type) {
                    var result = /([a-zA-Z_]+)(.*)/.exec(type),
                        rule = opts.rules[result[1]],
                        param = eval(result[2]);

                    if (rule) {
                        // 验证不通过
                        if (!rule['validator'](val, param)) {
                            var message = rule["message"];

                            for (var i = 0, ilen = param ? param.length : 0; i < ilen; i++) {
                                message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
                            }

                            // 添加错误红色文字提示
                            me.addError();

                            me._errormsg = message || $el.attr('placeholder');

                            return false;
                        } else {
                            // 验证通过
                            me.removeError()
                        }
                    }
                    return true;
                };

            opts = me._options;

            val = $el.val() ? $el.val().trim() : '';

            validType = opts.validType;

            if(me._eventName == 'input') {
                // 无错误提示，用户输入不进行input监听
                if( !$item.hasClass('fm-validate') ) {
                    return true;
                }else {
                    // 出现为空错误提示时，再进行输入则清除空错误提示，不进行校验
                    if(me._requiredError) {
                        me.removeError();
                        me._requiredError = false;
                        return true;
                    }
                }
            }

            // 只读和禁用按钮不进行校验
            if ($el.prop('readonly') || $el.prop('disabled')) {
                // 移除提示信息
                me.removeError();

                return true;
            }

            // required 处理
            opts.required = $el.prop('required') ? $el.prop('required') : opts.required;

            if(opts.required && !val) {
                // 显示错误提示
                me.addError();

                // 保持错误信息
                me._errormsg = opts.message || $el.attr('placeholder');

                me._requiredError = true;

                return false;
            }

            if(!opts.required && !val) return true;

            validType = typeof validType === 'string' ? [validType] : validType;

            // 数组
            for ( i = 0,ilen = Array.isArray(validType) ? validType.length : 0; i < ilen; i++) {
                if (!_doValid(validType[i])) {
                    return false;
                }
            }

            return true;
        },

        /**
         * 添加错误
         * @method addError
         * @public
         */
        addError: function() {
            this._$item && this._$item.addClass('fm-validate');
        },

        /**
         * 移除错误
         * @method removeError
         * @public
         */
        removeError: function() {
            this._$item && this._$item.removeClass('fm-validate');
        },

        /**
         * 字段是否有效
         * @method isValid
         * @public
         * @return {Boolean} true or false
         *
         */
        isValid: function() {
            this._eventName = '';
            return this._validate();
        }
    })
})(fmui, fmui.$);


/**
 * @authors      Benjamin
 * @link         https://github.com/benjamin-zuo
 * @date         2016-04-18 13:22:54
 * @description  CitySelect城市选择三级联动
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    require('/static/ui/overlay/overlay');

    fmui.define('Cityselect', {

        /**
         * @property {String}   url         请求数据URL
         * @property {Object}   province    省级Object
         * @property {Object}   city        市级Obejct
         * @property {Object}   district    区/县Object
         * @property {Boolean}  required    是否必填项
         * @property {Selector} className   选中结果text的selector选择器
         * @property {String}   placeholder 省市区隐藏域placeholder
         * @property {Number}   duration    动画时长，单位ms
         * @property {Number}   offsetLeft  城市选择面板距左边距离
         */
        options: {
            url: '',
            province: {
                title: '省份',
                name: 'province',
                code: '',
                data: null
            },
            city: {
                title: '市',
                name: 'city',
                code: '',
                data: null
            },
            district: {
                title: '区/县',
                name: 'district',
                code: '',
                data: null
            },
            required: true,
            className: '.fm-cityselect-texts',
            placeholder: '请选择省市区',
            duration: 300,
            offsetLeft: 60
        },
        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                opts = me._options,
                $el = me.getEl(),
                $hiddens = me._$hiddens = $('<div class="fm-cityselect-hiddens"></div>');

            $el.append($hiddens);
            // 统一placeholder color
            $el.find(opts.className).addClass('fm-cityselect-placeholder');

            me._tmplFun = __inline('./_cityselect.tmpl');

            // __flag 标识用来区分，有data时的重复请求
            me.__flag = true;

            // 绑定事件
            $el.on('click', function() {
                // 软键盘处理
                $('input').blur();

                me.__flag = true;

                // 软键盘兼容，延迟300ms
                setTimeout(function() {
                    me._createOverlay();

                    me._createDom('province');
                }, 300);
            });

            me.on('ready', function() {
                ['province', 'city', 'district'].forEach(function(value, index) {
                    opts[value].code && me._getData(value);
                });
                
                me._setValues();
                me._setTexts();

                $(window).on($.support.orientation ? 'orientationchange' : 'resize', function(e) {
                    me._layout();
                });
            });
        },

        /**
         * 初始化布局
         * @private
         */
        _layout: function() {
            var me = this,
                opts = me._options,
                $win = $(window),
                // Math.min()，解决IOS 9 safari 刷新获取宽度980的bug
                winW = Math.min($win.width(), $('body').width()),
                winH = $win.height(),
                offset = winW - opts.offsetLeft;

            me._winW = winW;
            me._winH = winH;
            // 初始化宽度
            ['district', 'city', 'province'].forEach(function(value, index) {
                var $module = opts[value].$module,
                    width = offset * (++index) / 3,
                    duration = opts.duration / 1000;

                opts[value].width = width;

                $module && $module.css({
                        width: width,
                        "-webkit-transform": "translate3d(" + -width + "px, 0, 0)",
                        "-webkit-transition": "-webkit-transform " + duration + "s linear",
                        "transform": "translate3d(" + -width + "px, 0, 0)",
                        "transition": "transform " + duration + "s linear"
                    })
                    .find('.fm-cityselect-content')
                    .height(winH - $module.find('.fm-cityselect-title').height());
            });
        },
        /**
         * 创建遮罩层
         * @private
         */
        _createOverlay: function() {
            var me = this,
                _overlay = me._overlay = $.overlay();

            _overlay.getEl().on('click', function() {
                me.destroy();
            });
        },

        /**
         * 初始化选中code的input[hidden]
         * @private
         */
        _setValues: function() {
            var me = this,
                opts = me._options,
                inputs = $.map(me._mergeObj(), function(value, key) {
                    return '<input type="hidden" name="' + value.name + '" id="' + value.name + '" value="' + value.code + '" placeholder="' + me._options.placeholder + '" required="'+ opts.required +'">';
                });

            me._$hiddens.html(inputs.join('\n'));

            return me;
        },
        /**
         * 初始化选中项文本
         * @pirvate
         */
        _setTexts: function(texts) {
            var me = this,
                $el = me.getEl(),
                opts = me._options,
                texts = $.map(me._mergeObj(), function(value, key) {
                    return value.text;
                });

            texts.length && $el.find(opts.className).removeClass('fm-cityselect-placeholder').text(texts.join(''));

            return me;
        },

        /**
         * 合并Object
         * @pirvate
         */
        _mergeObj: function() {
            var me = this,
                opts = me._options;

            return {
                province: opts.province,
                city: opts.city,
                district: opts.district
            };
        },
        /**
         * 创建各级DOM
         * @param  {String} type 省市级类型
         * @private
         */
        _createDom: function(type) {
            if (!type) return;

            var me = this,
                opts = me._options,
                typeobj = opts[type] || {},
                $module = typeobj['$module'],
                pcdobj = {
                    'province': 'city',
                    "city": 'district',
                    "district": ''
                };

            if ($module) {
                me._getData(type);
                return;
            } else {
                // 初始化模板
                $module = $(me._tmplFun({
                    title: typeobj.title
                })).attr('data-mode', type).appendTo('body');

                typeobj['$module'] = $module;

                me._layout();

                me._getData(type);

                // 绑定事件
                $module.on('click', 'li', function() {
                    var $this = $(this),
                        value = $this.data('value'),
                        className = type + '-selected',
                        $dismodule;

                    // 点击当前项不再处理
                    if (value == typeobj.code) {
                        type == 'district' && me.destroy();
                        return;
                    };

                    me.__flag = false;

                    typeobj.code = value;
                    typeobj.text = typeobj.data[value];

                    // 选中项
                    $this.addClass(className).siblings().removeClass(className);

                    switch (type) {
                        case 'province':
                            $dismodule = opts['district']['$module'];
                            $dismodule && $dismodule.off().remove();
                            opts['district']['$module'] = null;
                            break;
                        case 'district':
                            me._setValues()._setTexts().destroy();
                            break;
                    }

                    me._createDom(pcdobj[type]);

                    me.trigger('select');
                });
            }

            // 有code，初始化时创建动作
            if (typeobj.code) {
                me._createDom(pcdobj[type]);
            }
        },
        /**
         * 处理请求
         * @private
         * @param  {String} type 省市区类型
         */
        _getData: function(type) {
            var me = this,
                opts = me._options,
                typeobj = opts[type],
                codeObj = {
                    province: '',
                    city: opts['province'].code,
                    district: opts['city'].code
                };

            if(typeobj.data && me.__flag) {
                me._initList(type);
                return;
            }else {
                $.ajax({
                    type: 'POST',
                    url: opts.url,
                    data: {
                        type: type,
                        // 此处code需要处理
                        code: codeObj[type]
                    },
                    dataType: 'json',
                    async: false
                })
                .done(function(data) {
                    if (data) {
                        typeobj.data = data;

                        me._initList(type);
                    } else {
                        me._setValues()._setTexts();
                    }
                })
                .fail(function() {
                    typeobj.data = null;
                });
            }
        },

        /**
         * 初始化数据列表
         * @private
         * @param  {String} type 省市区类型
         */
        _initList: function(type) {
            var me = this,
                opts     = me._options,
                typeobj  = opts[type] || {},
                
                data     = typeobj.data,
                code     = typeobj.code,
                width    = typeobj.width,
                $module  = typeobj['$module'],
                className,offset,$content,
                html;

            typeobj.text = data[code];

            if(!$module) return;

            className = type + '-selected';
            $content = $module.find('.fm-cityselect-content');

            html = $.map(data, function(value, key) {
                return'<li data-value="' + key + '" ' + (code == key && ('class="'+ className + '"') ) + '>' + value + '</li>';
            });

            $content.html(html.join('\n'));

            // 选中项滚动到可视区域
            offset = $content.find('.' + className).offset();
            offset = offset ? offset.top : 0;
            (offset > me._winH) && $content.scrollTop(offset - me._winH / 2);
        },

        /**
         * 销毁组件
         * @method destroy
         * @public
         * @return {Self}
         */
        destroy: function() {
            var me = this,
                opts = me._options;

            $.each(me._mergeObj(), function(key, obj) {
                obj && obj.$module && obj.$module.off().remove();
                obj.$module = null;
            });

            me._overlay.destroy();

            return me.$super('destroy');
        }

        /**
         * @event destroy
         * @param {Event} e fmui.Event对象
         * @description CitySelect组件销毁时触发
         */
    });

})(fmui, fmui.$);
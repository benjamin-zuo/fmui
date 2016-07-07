/**
 * @authors      Benjamin,QuYing
 * @link         https://github.com/benjamin-zuo
 * @date         2016-04-18 13:22:54
 * @description  CitySelect城市选择三级联动
 */

var fmui = require('/static/ui/core/fmui');

require('/static/ui/overlay/overlay');

(function(fmui, $, undefined) {
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
            selectedClass: 'pcd-selected',
            placeholder: '请选择省市区',
            duration: 400,
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
            $el.find(opts.className).text(opts.placeholder).addClass('fm-cityselect-placeholder');

            me._tmplFun = __inline('./_cityselect.tmpl');

            // 绑定事件
            $el.on('click', function() {
                me.__isLiClick = false;
                // 软键盘处理
                $('input').blur();

                // 软键盘兼容，延迟300ms
                setTimeout(function() {
                    me._createOverlay();

                    me._createDom('province');
                }, 300);
            });

            me.on('ready', function() {
                me.__isLiClick = false;
                // 初始化
                ['province', 'city', 'district'].forEach(function(type, index) {
                    opts[type].code && me._getData(type);
                });
                
                me._setValues()._setTexts();

                $(window).on($.support.orientation ? 'orientationchange' : 'resize', function(e) {
                    ['province', 'city', 'district'].forEach(function(type, index) {
                        me._layout(type);
                    });
                });
            });
        },
        /**
         * 创建各级DOM
         * @param  {String} type 省市级类型
         * @private
         */
        _createDom: function(type) {
            var me = this;

            if (!type) {
                me._setValues()._setTexts().destroy();
                return;
            }

            var opts = me._options,
                typeobj = opts[type] || {},
                $module = typeobj['$module'],
                pcdobj = {
                    'province': 'city',
                    "city": 'district',
                    "district": ''
                };

            // 请求数据
            me._getData(type);

            if(typeobj.data) {
                typeobj['$module'] = $module = $module ? $module : $(me._tmplFun( {title: typeobj.title} ) );

                me._initList(type);

                $module.attr('data-mode', type).appendTo('body');

                me._layout(type);

                // 绑定事件
                $module.on('click', 'li', function() {
                    var $this = $(this),
                        value = $this.data('value'),
                        className = opts.selectedClass,
                        $dismodule;

                    me.__isLiClick = true;

                    typeobj.code = value;
                    typeobj.text = typeobj.data[value];

                    // 选中项
                    $this.addClass(className).siblings().removeClass(className);

                    // 级联操作
                    me._createDom(pcdobj[type]);
                })
                // 取消
                .on('click', '.btn-cancel', function() {
                    me.destroy();
                })
                // 返回
                .on('click', '.arrow-left', function() {
                    type !== 'province' && ( me._removeModule(opts[type]), me._removeData(opts[type]) );
                });
            }else {
                me._setValues()._setTexts().destroy();
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

            (!typeobj.data || me.__isLiClick) && 
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
                if(data) {
                    typeobj.data = data;
                }else {
                    typeobj.data = null;
                }
            })
            .fail(function() {
                typeobj.data = null;
            });


            if(typeobj.data) {
                typeobj.text = typeobj.code ? typeobj.data[typeobj.code] : '';    
            }else {
                me._removeData(opts[type]);
                type == 'province' && (me._removeData(opts['city']), me._removeData(opts['district']) );
                type == 'city' && me._removeData(opts['district']);
            }
        },

        /**
         * 初始化数据列表
         * @private
         * @param  {String} type 省市区类型
         */
        _initList: function(type) {
            var me = this,
                opts      = me._options,
                typeobj   = opts[type] || {},

                data      = typeobj.data,
                code      = typeobj.code,
                width     = typeobj.width,
                $module   = typeobj['$module'],
                offset,$content,
                html;

            if(!$module) return;
            $content = $module.find('.fm-cityselect-content');

            html = $.map(data, function(text, key) {
                return'<li data-value="' + key + '" class="fm-list-item ' + (code == key ? opts.selectedClass : '' ) + '"><div class="fm-list-content">' + text + '</div></li>';
            });

            $content.html(html.join('\n'));
        },
        /**
         * 初始化布局
         * @private
         */
        _layout: function(type) {
            var me = this,
                opts = me._options,
                $module = opts[type].$module,
                $win = $(window),
                duration = opts.duration / 1000,
                offset,winW,winH,cityselectH, $content;

            if(!$module) return;

            me._winW = winW = Math.min($win.width(), $('body').width());
            me._winH = winH = $win.height();

            cityselectH = winH * 0.7; 

            $content = $module.find('.fm-cityselect-content');
            $module.css({
                height: cityselectH,
                "-webkit-transform": "translate3d(0,"+ -cityselectH + "px, 0)",
                "-webkit-transition": "-webkit-transform " + duration + "s linear",
                "transform": "translate3d(0,"+ -cityselectH + "px, 0)",
                "transition": "transform " + duration + "s linear"
            });
            
            $content.height(cityselectH - $module.find('.fm-cityselect-header').height());

            // 选中项滚动到可视区域
            offset = $content.find('.' + opts.selectedClass).position();
            offset = offset ? offset.top : 0;
            offset = offset > cityselectH ? (offset - cityselectH / 2) : 0;
            
            $content.scrollTop(offset);
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
                mergeobj = me._mergeObj(),
                initRequired = true,
                required = 'required="'+ opts.required + '"',
                inputs;

            // 此处处理初始化各项为空时，必填标识
            $.each(mergeobj, function(key, item) {
                if(item.code) {
                    initRequired = false;
                    return false;
                }
            });

            inputs = $.map(mergeobj, function(item, key) {
                var _required = initRequired ? required : (item.code ? required : '');

                return '<input type="hidden" name="' + item.name + '" id="' + item.name + '" value="' + item.code + '" placeholder="' + opts.placeholder +'"'+ _required +'>';    
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
                }),
                _text = texts.join('');

            $el.find(opts.className)[_text.length ? 'removeClass' : 'addClass']('fm-cityselect-placeholder').text(_text.length ? _text : opts.placeholder);

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
         * 移除module
         * @private
         */
        _removeModule: function(obj) {
            if(obj && obj['$module']) {
                obj['$module'].off().remove();
                obj['$module'] = null;
            }
        },
        /**
         * 移除数据
         * @private
         */
        _removeData: function(obj) {
            obj.code = '';
            obj.text = '';
            obj.data = null; 
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
                me._removeModule(obj);
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
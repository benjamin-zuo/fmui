/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-21 17:03:51
 * @description  Scrollload 滚动加载组件
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
    fmui.define('Scrollload', {
        isNotShared: true,
        /**
         * @property {String} container   加载数据容器, 支持selector选择器
         * @property {String} url         请求URL
         * @property {Object} queryParams 查询参数 
         * 例如：
         * ```
         * {
         *     page: 1,
         *     rows: 20,
         *     username: '张三'
         * }
         * ```
         * @property {Nubmer}  offset 滚动临界值
         * @property {Boolean} async  是否异步请求
         * @property {Number}  page   请求页数
         * @property {Nubmer}  rows   请求每页记录数
         */
        options: {
            container: 'body',
            url: '',
            queryParams: null,
            offset: 30,
            async: true,
            page: 1,
            rows: 10
        },
        /**
         * 初始化
         * @private
         */
        _init: function() {
            var me = this,
                opts = me._options,
                $win = $(window),
                winH = $win.height();
                
            $win.on('scroll.scrollload', function() {
                if('loading' == me.__status || 'finished' == me.__status) return;

                if(winH + $win.scrollTop() + opts.offset > $(document).height()) {
                    me.__status = 'loading';

                    me.loadData();
                }
            });
        },
        /**
         * 加载数据
         * @param {Boolean} isReload 是否重载数据
         * @return {[type]} [description]
         */
        loadData: function(isReload) {
            var me = this,
                opts = me._options;

            me.trigger('beforeLoad');

            $.ajax({
                url: opts.url,
                type: 'post',
                data: $.extend(opts.queryParams || {}, {
                    page: opts.page || 1,
                    rows: opts.rows || 10
                }),
                async: opts.async,
                dataType: 'json'
            })
            .always(function() {
                me.__status = 'complete';

                me.trigger('complete');
            })
            .done(function(data) {
                var tmpl;
                if(!data) return;
                opts.data = data;

                // Format data
                if(data.rows && data.rows.length) {
                    tmpl = 'function' == typeof opts.formatData ? opts.formatData(data) : '';

                    // 极限判断
                    if(data.total == data.rows.length || data.total <= opts.page * opts.rows) {
                        tmpl += '<p class="norecord">无更多记录</p>';
                        me.__status = 'finished';
                    }
                }else {
                    isReload = true;
                    tmpl = '<p class="norecord">无相关记录</p>';
                }

                // init DOM
                $(opts.container || 'body')[isReload ? 'html' : 'append'](tmpl);

                opts.page ++;

                me.trigger('success');
            })
            .fail(function() {
                me.trigger('fail');
            });
        },

        /**
         * 加载数据，需要考虑分页，现在业务场景不涉及，接口预留
         * @param  {Object} options [配置项]
         * @return self
         */
        load: function(options) {

        },

        /**
         * 重新加载数据
         * @param  {Object} options [配置项]
         * @return self
         */
        reload: function(options) {
            var me = this;
            me._options = $.extend({}, me._options, options, {page: 1});

            me.loadData(true);
        }

        /**
         * @event beforeLoad
         * @param {Event} e fmui.Event对象
         * @description 请求数据前回调
         *
         * @event success
         * @param {Event} e fmui.Event对象
         * @description 请求成功时回调
         *
         * @event fail
         * @param {Event} e fmui.Event对象
         * @description 请求失败时回调
         *
         * @event complete
         * @param {Event} e fmui.Event对象
         * @description 请求完成(成功或失败)时回调
         */
    });

})(fmui, fmui.$);



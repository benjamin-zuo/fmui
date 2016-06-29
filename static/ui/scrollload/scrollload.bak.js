/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-06-14 13:43:05
 * @description  滚动加载插件
 */

function Scrollload(options) {
    var me = this;

    if(! me instanceof Scrollload) {
        return new Scrollload(options);
    }

    me.defaults = {
        url: '',
        queryParams: null,
        offset: 30,
        async: true,
        page: 1,
        rows: 10,
        container: 'body',
        fomatData: function() {},
        onSuccess: function(){},
        onFail: function(){},
        onBeforeLoad: function(){},
        onComplete: function() {}
    };

    me._isFun = function(fun) {
        return 'function' === typeof fun;
    };

    me.options = $.extend({}, me.defaults, options);

    me.init();
}

Scrollload.prototype.init = function() {
    var me = this,
        opts = me.options,
        $win = $(window),
        winH = $win.height();
        
    $win.on('scroll.scrollload', function() {
        if('loading' == me.status || 'finished' == me.status) return;

        if(winH + $win.scrollTop() + opts.offset > $(document).height()) {
            me.status = 'loading';

            me.loadData();
        }
    });

    return this;
}

/**
 * 加载数据
 * @param  {Boolean} isReload
 * @return {[type]}           [description]
 */
Scrollload.prototype.loadData = function(isReload) {
    var me = this,
        opts = me.options;

    me._isFun(opts.onBeforeLoad) && opts.onBeforeLoad();
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
        me.status = 'complete';
        me._isFun(opts.onComplete) && opts.onComplete();
    })
    .done(function(data) {
        var tmpl;
        if(!data) return;
        opts.data = data;

        // Format data
        if(data.rows && data.rows.length) {
            tmpl = me._isFun(opts.formatData) ? opts.formatData(data) : '';

            // 极限判断
            if(data.total == data.rows.length || data.total <= opts.page * opts.rows) {
                tmpl += '<p class="norecord">无更多记录</p>';
                me.status = 'finished';
            }
        }else {
            isReload = true;
            tmpl = '<p class="norecord">无相关记录</p>';
        }

        // init DOM
        $(opts.container || 'body')[isReload ? 'html' : 'append'](tmpl);

        opts.page ++;

        me._isFun(opts.onSuccess) && opts.onSuccess();
    })
    .fail(function() {
        me._isFun(opts.onFail) && opts.onFail();
    });
};

/**
 * 加载数据，需要考虑分页，现在业务场景不涉及，接口预留
 * @param  {Object} options [配置项]
 * @return self
 */
Scrollload.prototype.load = function(options) {}

/**
 * 重新加载数据
 * @param  {Object} options [配置项]
 * @return self
 */
Scrollload.prototype.reload = function(options) {
    this.options = $.extend({}, this.options, options, {page: 1});

    this.loadData(true);
}

return Scrollload;
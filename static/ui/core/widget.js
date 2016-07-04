/**
 * @file fmui底层，定义了创建fmui组件的方法
 * @import core/event.js
 * @module widget
 */

var fmui = require('./event');

(function( fmui, $, undefined ) {
    var slice = [].slice,

        blankFn = function() {},

        // 挂到组件类上的属性、方法
        staticlist = [ 'options'],

        /**
         * [存储和读取数据到指定对象，任何对象包括dom对象]
         * @description 数据不直接存储在object上，而是存在内部闭包中，通过_gid关联
         * record( object, key ) 获取object对应的key值
         * record( object, key, value ) 设置object对应的key值
         * record( object, key, null ) 删除数据
         */
        record = (function() {
            var data = {},
                id = 0,
                ikey = '_gid';    // internal key.

            return function( obj, key, val ) {
                var dkey = obj[ ikey ] || (obj[ ikey ] = ++id),
                    store = data[ dkey ] || (data[ dkey ] = {});

                val !== undefined && (store[ key ] = val);
                val === null && delete store[ key ];

                return store[ key ];
            };
        })(),

        event = fmui.event;

    /**
     * [eachObject 遍历对象]
     * @param  {Object}   obj      待遍历对象
     * @param  {Function} iterator 迭代器函数
     */
    function eachObject( obj, iterator ) {
        obj && Object.keys( obj ).forEach(function( key ) {
            iterator( key, obj[ key ] );
        });
    }

    /**
     * [parseData 格式化数据]
     * @param  {all} data 需要格式化的数据
     * @return {all}      格式化后的数据
     * @description 此处需要注意需要做单引号替换处理，不然JSON.parse解析会报错，当
     * data === null 时，表示没有该属性
     */
    function parseData( data ) {
        try {    
            data = data === 'true' ? true :
                    data === 'false' ? false : 
                    data === 'null' ? null :
                    +data + '' === data ? +data :
                    /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ? JSON.parse( data.replace(/'/g, '"') ) : 
                    data;
        } catch ( ex ) {
            data = undefined;
        }
        return data;
    }

    /**
     * [parseOptions 解析DOM配置项中data-*数据值]
     * @param  {Object} el 当前节点元素
     * @return {Object}    解析后的对象
     * @description 使用dataset并做兼容性处理,data-options={'key': 'value'}
     */
    function parseOptions( el ) {
        var ret = {},
            attrs,
            len,
            key,
            data;

        if(document.documentElement.dataset) {
            return parseData(el && el.dataset && el.dataset.options);
        }else {
            attrs = el && el.attributes;
            len = attrs && attrs.length;

            while ( len-- ) {
                data = attrs[ len ];
                key = data.name;

                if ( key.substring(0, 5) !== 'data-' ) {
                    continue;
                }

                key = key.substring( 5 );
                data = parseData( data.value );

                data === undefined || (ret[ key ] = data);
            }
        }

        return ret;
    }

    /**
     * [zeptolize 组件实例化]
     * @param  {String} 组件名称
     * @param  {Object} 配置扩展项
     * @return {Object} 实例化后的对象
     * 
     * nonInstance为false(默认):
     * 在$.fn上挂对应的组件方法
     * $('#dialog').dialog( options );实例化组件
     * $('#dialog').button( 'show' ); 调用实例方法
     * $('#dialog').button( 'this' ); 取组件实例
     *
     * nonInstance为true：
     * 挂载到$下，如$.toast()来实例化
     * 
     */
    function zeptolize( name, object ) {
        var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
            nonInstance = !!object.nonInstance,
            old = nonInstance ? $[key] : $.fn[ key ];

        if(object.nonInstance) {
            $[key] = function(opts) {
                return new fmui[ name ]($.isPlainObject( opts ) ? opts : {} ) || this;
            };
            return;
        }

        $.fn[key] = function( opts ) {
            var args = slice.call( arguments, 1 ),
                method = typeof opts === 'string' && opts,
                ret,
                obj;

            $.each( this, function( i, el ) {

                // 从缓存中取，没有则创建一个
                obj = record( el, name ) || new fmui[ name ]( el,
                        $.isPlainObject( opts ) ? opts : undefined );

                // 取实例
                if ( method === 'this' ) {
                    ret = obj;
                    return false;    // 断开each循环
                } else if ( method ) {

                    // 当取的方法不存在时，抛出错误信息
                    if ( !$.isFunction( obj[ method ] ) ) {
                        throw new Error( '组件没有此方法：' + method );
                    }

                    ret = obj[ method ].apply( obj, args );

                    // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
                    if ( ret !== undefined && ret !== obj ) {
                        return false;
                    }

                    // ret为obj时为无效值，为了不影响后面的返回
                    ret = undefined;
                }
            } );

            return ret !== undefined ? ret : this;
        };

        /*
         * NO CONFLICT
         * var fmuiPanel = $.fn.panel.noConflict();
         * fmuiPanel.call(test, 'fnname');
         */
        $.fn[key].noConflict = function() {
            $.fn[key] = old;
            return this;
        };
    }

    // 合并对象
    function mergeObj() {
        var args = slice.call( arguments ),
            i = args.length,
            last;

        while ( i-- ) {
            last = last || args[ i ];
            $.isPlainObject( args[ i ] ) || args.splice( i, 1 );
        }

        return args.length ?
                $.extend.apply( null, [ true, {} ].concat( args ) ) : last; // 深拷贝，options中某项为object时，用例中不能用==判断
    }

    // 初始化widget. 隐藏具体细节，因为如果放在构造器中的话，是可以看到方法体内容的
    // 同时此方法可以公用。
    function bootstrap( name, klass, uid, el, options ) {
        var me = this,
            opts;

        if ( $.isPlainObject( el ) ) {
            options = el;
            el = undefined;
        }

        // options中存在el时，覆盖el
        options && options.el && (el = $( options.el ));

        el && (me.$el = $( el ), el = me.$el[ 0 ]);

        opts = me._options = mergeObj( klass.options,
                parseOptions( el ), options );

        // 生成eventNs widgetName
        me.widgetName = name.toLowerCase();
        me.eventNs = '.' + me.widgetName + uid;

        me._init( opts );

        // 进行创建DOM等操作
        me._create();

        me.trigger( 'ready' );

        el && record( el, name, me ) && me.on( 'destroy', function() {
            record( el, name, null );
        } );

        return me;
    }

    /**
     * @desc 创建一个类，构造函数默认为init方法, superClass默认为Base
     * @name createClass
     * @grammar createClass(object[, superClass]) => fn
     */
    function createClass( name, object, superClass ) {
        if ( typeof superClass !== 'function' ) {
            superClass = fmui.Base;
        }

        var uuid = 1,
            suid = 1;

        function klass( el, options ) {
            if ( name === 'Base' ) {
                throw new Error( 'Base类不能直接实例化' );
            }

            if ( !(this instanceof klass) ) {
                return new klass( el, options );
            }

            return bootstrap.call( this, name, klass, uuid++, el, options );
        }

        $.extend( klass, {

            /**
             * @name option
             * @grammar klass.option(option, value, method)
             * @desc 扩充组件的配置项
             */
            option: function( option, value, method ) {
                var options = record( klass, 'options' ) ||
                        record( klass, 'options', {} );

                options[ option ] || (options[ option ] = []);
                options[ option ].push([ value, method ]);

                return klass;
            },

            /**
             * @name extend
             * @grammar klass.extend({})
             * @desc 扩充现有组件
             */
            extend: function( obj ) {
                var proto = klass.prototype,
                    superProto = superClass.prototype;

                staticlist.forEach(function( item ) {
                    obj[ item ] = mergeObj( superClass[ item ], obj[ item ] );
                    obj[ item ] && (klass[ item ] = obj[ item ]);
                    delete obj[ item ];
                });

                // todo 跟plugin的origin逻辑，公用一下
                eachObject( obj, function( key, val ) {
                    if ( typeof val === 'function' && superProto[ key ] ) {
                        proto[ key ] = function() {
                            var $super = this.$super,
                                ret;

                            // todo 直接让this.$super = superProto[ key ];
                            this.$super = function() {
                                var args = slice.call( arguments, 1 );
                                return superProto[ key ].apply( this, args );
                            };

                            ret = val.apply( this, arguments );

                            $super === undefined ? (delete this.$super) :
                                    (this.$super = $super);
                            return ret;
                        };
                    } else {
                        proto[ key ] = val;
                    }
                } );
            }
        } );

        klass.superClass = superClass;

        klass.prototype = Object.create( superClass.prototype );


        /*// 可以在方法中通过this.$super(name)方法调用父级方法。如：this.$super('enable');
        object.$super = function( name ) {
            var fn = superClass.prototype[ name ];
            return $.isFunction( fn ) && fn.apply( this,
                    slice.call( arguments, 1 ) );
        };*/

        klass.extend( object );

        return klass;
    }

    /**
     * @method define
     * @grammar fmui.define( name, object[, superClass] )
     * @param {String} name 组件名字标识符。
     * @param {Object} object
     * @desc 定义一个fmui组件
     * 
     * ### 组件定义
     * ```javascript
     * fmui.define( 'Button', {
     *     _create: function() {
     *         var $el = this.getEl();
     *
     *         $el.addClass( 'ui-btn' );
     *     },
     *
     *     show: function() {
     *         console.log( 'show' );
     *     }
     * });
     * ```
     * 
     * #### html部分
     * ```html
     * <a id='btn'>按钮</a>
     * ```
     *
     * #### javascript部分
     * ```javascript
     * var btn = $('#btn').button();
     *
     * btn.show();    // => show
     * ```
     *
     */
    fmui.define = function( name, object, superClass ) {

        fmui[ name ] = createClass( name, object, superClass );

        zeptolize( name, object );
    };

    /**
     * @desc 判断object是不是 widget实例, klass不传时，默认为Base基类
     * @method isWidget
     * @grammar fmui.isWidget( anything[, klass] ) => Boolean
     * @param {*} anything 需要判断的对象
     * @param {String|Class} klass 字符串或者类。
     * @example
     * 
     * ```javascript
     * var a = new fmui.Button();
     *
     * console.log( fmui.isWidget( a ) );    // => true
     * console.log( fmui.isWidget( a, 'Dropmenu' ) );    // => false
     * ```
     */
    fmui.isWidget = function( obj, klass ) {
        // 处理字符串的case
        klass = typeof klass === 'string' ? fmui[ klass ] || blankFn : klass;
        klass = klass || fmui.Base;
        return obj instanceof klass;
    };

    /**
     * @description widget基类。不能直接使用。
     */
    fmui.Base = createClass( 'Base', {

        /**
         * @method _init
         * @grammar instance._init() => instance
         * @desc 组件的初始化方法，子类需要重写该方法
         */
        _init: blankFn,

        /**
         * @override
         * @method _create
         * @grammar instance._create() => instance
         * @desc 组件创建DOM的方法，子类需要重写该方法
         */
        _create: blankFn,


        /**
         * @method getEl
         * @grammar instance.getEl() => $el
         * @desc 返回组件的$el
         */
        getEl: function() {
            return this.$el;
        },

        /**
         * @method on
         * @grammar instance.on(name, callback, context) => self
         * @desc 订阅事件
         */
        on: event.on,

        /**
         * @method one
         * @grammar instance.one(name, callback, context) => self
         * @desc 订阅事件（只执行一次）
         */
        one: event.one,

        /**
         * @method off
         * @grammar instance.off(name, callback, context) => self
         * @desc 解除订阅事件
         */
        off: event.off,

        /**
         * @method trigger
         * @grammar instance.trigger( name ) => self
         * @desc 派发事件, 此trigger会优先把options上的事件回调函数先执行
         * options上回调函数可以通过调用event.stopPropagation()来阻止事件系统继续派发,
         * 或者调用event.preventDefault()阻止后续事件执行
         */
        trigger: function( name ) {
            var evt = typeof name === 'string' ? new fmui.Event( name ) : name,
                args = [ evt ].concat( slice.call( arguments, 1 ) ),
                opEvent = this._options && this._options[ evt.type ];

                // 先存起来，否则在下面使用的时候，可能已经被destory给删除了。
                $el = this.getEl();

            if ( opEvent && $.isFunction( opEvent ) ) {

                // 如果返回值是false,相当于执行stopPropagation()和preventDefault();
                false === opEvent.apply( this, args ) &&
                        (evt.stopPropagation(), evt.preventDefault());
            }

            event.trigger.apply( this, args );

            // triggerHandler不冒泡
            $el && $el.triggerHandler( evt, (args.shift(), args) );

            return this;
        },

        /**
         * @method destroy
         * @grammar instance.destroy()
         * @desc 注销组件
         */
        destroy: function() {

            // 解绑element上的事件
            this.$el && this.$el.off( this.eventNs );

            this.trigger( 'destroy' );

            // 解绑所有自定义事件
            this.off();


            this.destroyed = true;
        }
    }, Object );

})( fmui, fmui.$ );

return fmui;
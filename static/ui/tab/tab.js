/**
 * 
 * @authors      HuangChengWen
 * @contributors Benjamin
 * @link         https://github.com/Eric124120,https://github.com/benjamin-zuo
 * @date         2016-3-31 10:51:57
 * @description  Tab组件
 */

var fmui = require('/static/ui/core/fmui');

(function(fmui, $, undefined) {
	fmui.define('Tabs', {
		/**
		 * @property {Number} index    默认选中Tab索引[从0开始]
		 * @property {String} type     切换方式[swipe，normal，默认swipe]
		 * @property {Number} duration 动画时长，默认400，单位ms
		 * @property {Object} effect   动画效果定义，可扩展
		 */
		options: {
			index: 0,
			type: "swipe",
			duration: 400,
			effect: {
				swipe: function(noTransition) {
					var me = this,
						opts = me._options,
						duration = noTransition ? 0 : opts.duration,
						itemWidth = me._contentItems.width(),
						translate = 0 - opts.index * itemWidth;

					me._tabContent.css({
						"transition":  "transform "+ duration + "ms ease",
						"transform": "translate3d("+ translate + "px, 0, 0)",
						"-webkit-transition": "-webkit-transform "+ duration +"ms ease",
						"-webkit-transform": "translate3d("+ translate + "px, 0, 0)"
					});
				},
				normal: function() {
					var me = this;
					me._contentItems.eq(me._options.index).show().siblings().hide();
				}
			}
		},

		/**
		 * @初始化化
		 * @private
		 */
		_init: function() {
			var me = this,
				opts = me._options,
				$el = me.getEl();

			me._tabTitle = $el.find(".fm-tab-title");
			me._titleItems = $el.find(".fm-tab-title-item");

			me._tabContent = $el.find(".fm-tab-content");
			me._contentItems = $el.find(".fm-tab-content-item");

			if(!me._titleItems.length) return;

			//样式初始化
			me._initStyle();

			me.select(opts.index, true);

			me._bindEvent();
		},

		/**
		 * 初始样式
		 * @private
		 */
		_initStyle: function() {
			var me = this,
				opts = me._options,
				type = opts.type,
				effectobj = {
					swipe: {
						width: me._titleItems.length + "00%",
						visibility: 'visible'
					},
					normal: {
						display: 'none',
						visibility: 'visible'
					}
				};

			me._tabContent.css(effectobj[type ? type : 'normal']);

			//窗体改变时（横竖屏时）重新设置item宽度
			$(window).on($.support.orientation ? 'orientationchange' : 'resize', function() {
				me.select(opts.index, true);
			});
		},

		/**
		 * 绑定事件
		 * @private
		 */
		_bindEvent: function() {
			var me = this,
				opts = me._options,
				$el = me.getEl(),

				startPageX, startPageY,
				offsetLeft, slide,
				eventCallback;

			//点击_tabTitle触发切换
			$el.on('tap', '.fm-tab-title-item', function() {
				var $this = $(this);

				if ($this.hasClass("selected")) return;

				me.select($this.index());
			});

			//touch事件
			if (opts.type != "swipe") return;

			eventCallback = {
				'touchstart': function(e) {
					var itemWidth = me._contentItems.width();

					startPageX = e.touches[0].pageX;
					startPageY = e.touches[0].pageY;

					offsetLeft = 0;

					slide = -opts.index * itemWidth;
				},
				'touchmove': function(e) {
					offsetLeft = e.touches[0].pageX - startPageX;

					me._tabContent.css({
						"transition": "transform 0ms ease",
						"transform": "translate3d(" + (slide + offsetLeft) + "px, 0px, 0px)",
						"-webkit-transition": "-webkit-transform 0ms ease",
						"-webkit-transform": "translate3d(" + (slide + offsetLeft) + "px, 0px, 0px)"
					});
				},
				'touchend': function(e) {
					//控制偏移量触发
					var flag = (Math.abs(offsetLeft) >= 30),
						index = opts.index,
						tabsLen = me._titleItems.length,
						dir_r = offsetLeft > 0 && index > 0 && flag,
						dir_l = offsetLeft < 0 && index < tabsLen - 1 && flag;

					index += dir_r ? -1 : dir_l ? 1 : 0;

					me.select(index);
				}
			};

			$el.on('touchstart touchmove touchend', '.fm-tab-content', function(e) {
				eventCallback[e.type](e);
			});
		},

		/**
		 * tab项选中
		 * @property {Number} index tab索引，从0开始
		 * @property {Boolean} noTransition 是否执行动画
		 * @method select
		 * @public
		 */
		select: function(index, noTransition) {
			var me = this,
				opts = me._options;

			opts.index = index;
			me._titleItems.eq(index).addClass("selected").siblings().removeClass("selected");
			opts.effect[opts.type].call(me, noTransition);

			return me.trigger('select');
		}
	});

})(fmui, fmui.$, undefined);
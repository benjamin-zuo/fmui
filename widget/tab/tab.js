/**
 * 
 * @authors      huangchengwen
 * @link         https://github.com/benjamin-zuo
 * @date         2016-3-31 10:51:57
 * @description  tab组件
 * @version      $Id$
 */
//zepto引入
var $ = require('zepto');
//组件引入
require('fmui:static/ui/tab/tab');

//组件调用
var $tabs = $("#fm-tabs").tabs({
	index: 1
});
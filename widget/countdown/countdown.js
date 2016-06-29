/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-30 16:56:12
 * @description  
 * @version      $Id$
 */

var $ = require('zepto');

require('/static/ui/countdown/countdown');

$('#demo1').countdown({
    template: '${d}天${h}时${m}分${s}秒'
}).on('complete', function() {
    console.log('demo1');
}).countdown('start');

$('#demo2').countdown({
    template: '${d}天${h}时${m}分${s}秒'
}).on('complete', function() {
    console.log('demo2');
}).countdown('start');

$('#demo3').countdown({
    leftTime: 60,
    template: '${m}分${s}秒'
}).on('complete', function() {
    console.log('demo2');
}).countdown('start');

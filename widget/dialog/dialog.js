/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-24 17:20:37
 * @description  
 * @version      $Id$
 */

var $ = require('zepto');

require('/static/ui/dialog/dialog');

var $a = $('<div/>').dialog({
    title: '我是标题',
    content: '博鳌论坛今日开幕！！！',
    buttons: {
        'Destory': function(me) {
            me.destroy();
        },
        'Hide': function(me) {
            me.hide();
        }
    }
}).on('show', function() {
    alert('show');

}).on('hide', function() {
    var me = this;

    setTimeout(function() {
        $a.dialog('show');
    }, 2000);

}).on('destroy', function() {
    alert('destroy');
});
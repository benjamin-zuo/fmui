/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-23 18:24:15
 * @description  
 * @version      $Id$
 */


var $ = require('zepto');

require('/static/ui/toast/toast');

var doAction = {
    success: function() {
        $.toast({
/*            content: '提交成功',*/
            type: 'success'
        });
    },
    fail: function() {
        $.toast({
            content: '提交失败',
            type: 'fail'
        });
    },
    loading: function() {
        var a = $.toast({
            content: '载入中',
            type: 'loading',
            autoClose: false
        }).on('destroy', function() {
            alert('destroy');
        });

        setTimeout(function() {
            a.destroy();
        }, 5000);
    },
    network: function() {
        $.toast({
            content: '连接失败',
            type: 'network'
        });
    },
    none: function() {
        $.toast({
/*            content: '只有content只有content'*/
        });
    }
}

$('body').on('tap', '[data-action]', function(){
    var action = $(this).data('action');

    doAction[action]();
})

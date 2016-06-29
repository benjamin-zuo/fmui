/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-23 18:24:15
 * @description  
 * @version      $Id$
 */


var $ = require('zepto');

require('/static/ui/actionsheet/actionsheet');

var actionsheet = $.actionSheet({
    items: {
        '选项一': function() {
            alert('A');
        },
        '选项二': function() {
            alert('B');
        }
    }
}).on('hide', function() {
    // todo
});

$('#btn-click-1').on('click', function() {
    actionsheet.show();
});

$('#btn-click-2').on('click', function() {
    var _actionsheet = $.actionSheet({
        items: {
            '选项一': function() {
                alert('A');
            },
            '选项二': function() {
                alert('B');
            }
        }
    }).on('hide', function() {
        _actionsheet.destroy();
    });

    _actionsheet.show();
})
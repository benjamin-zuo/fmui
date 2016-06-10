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

$('#btn-click').on('tap', function() {
    $.actionSheet({
        items: {
            '选项一': function() {
                alert('A');
            },
            '选项二': function() {
                alert('B');
            }
        }
    }).on('destroy', function() {
        alert('=====destroy=====');
    });
})
/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-24 17:20:37
 * @description  
 * @version      $Id$
 */

var $ = require('zepto');

require('/static/ui/signature/signature');

$.signature({
    buttons: [{
        text: '重新签名',
        className: 'fm-button white',
        handler: function(me){
            me._signatureObj.clear();
        }
    }, {
        text: '完成签名',
        className: 'fm-button orange',
        handler: function(me){
            if(me._signatureObj.isEmpty()) {
                alert('签名不能为空');
            }
        }
    }]
})
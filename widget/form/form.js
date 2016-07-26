/**
 * 
 * @authors      Benjamin (cuew1987@gmail.com)
 * @link         https://github.com/benjamin-zuo
 * @date         2016-03-21 20:03:18
 * @description  
 * @version      $Id$
 */


var $ = require('zepto');
require('/static/ui/autoclear/autoclear');
require('/static/ui/validate/validate');

require('/static/ui/form/form');

$('input[name="a"]').on('click', function() {
    var val = $(this).val();

    var phone = $('#phone').validate({
        required: val == 1,
        validType: 'tel'
    });  
})

var $form = $('#form');

$form.on('tap', '#btn-submit', function() {
    console.log($form.form('validate'));
})

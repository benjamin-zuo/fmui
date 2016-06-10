fis.require('arrow')(fis);

// 命名空间
fis.config.set('namespace', 'fmui');

fis.hook('commonjs', {
    paths: {
        zepto: '/components/zepto'
    }
});

fis
.match('/widget/*/*.vm', {
    useSameNameRequire: true
})

// ui组件
.match('/static/ui/(**.js)', {
    isMod: true
})

/**
 * -------------------------------------------------------
 * Production Environment
 * -------------------------------------------------------
 */

fis.media('prod')
.match('/static/ui/{core,autoclear,combobox,actionsheet,cityselect,countdown,dialog,form,overlay,toast,validate}/*.js', {
    packTo: '/static/fmui.js'
})

.match('/static/ui/imagecompresser/*.js', {
    packTo: '/static/imagecompresser.js'
})

.match('/static/ui/signature/*.js', {
    packTo: '/static/signature.js'
})

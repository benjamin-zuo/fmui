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
});

/**
 * -------------------------------------------------------
 * Production Environment
 * -------------------------------------------------------
 */

fis.media('prod')
.set('version', '0.0.3')

.set('imgcdnurl', 'http://xxx.xxxcdn.com.cn/che_static')
.set('jscsscdnurl', 'http://xxx.xxxcdn.com.cn/che_static')

.match('*.{scss,css,js}', {
    domain: '${jscsscdnurl}'
})
.match('*.{png,jpg,jpeg}', {
    domain: '${imgcdnurl}'
})

.match('/{page,widget,test}/**', {
    release: false
})
.match('/static/ui/{core,autoclear,combobox,actionsheet,cityselect,countdown,dialog,form,overlay,toast,tooltip,validate}/*.js', {
    useHash: false,
    packTo: '/static/fmui.js'
})

.match('{/static/img/**,jsdoc-conf.json,*.md}', {
    release: false
})

.match('/static/ui/imagecompresser/*.js', {
    packTo: '/static/imagecompresser.js'
})

.match('/static/ui/signature/*.js', {
    packTo: '/static/signature.js'
})

.match('/static/fmui.scss', {
    useHash: false,
    release: '/static/${namespace}/fmui-v${version}.css'
})
.match('/static/fmui.js', {
    useHash: false,
    release: '/static/${namespace}/fmui-v${version}.js'
})

.match('*.{jpg,jpeg}', {
    useHash: true
})

// 兼容58WF框架
.set('templates', '/views')
.match('*.vm', {
    url: '/views/${namespace}$0',
    preprocessor: fis.plugin('extlang', {
        type: 'velocity'
    }),
    rExt: '.html'
});

/**
 * -------------------------------------------------------
 * RD Environment
 * -------------------------------------------------------
 */

fis.media('rd')
.set('templates', '/views')
.match('*', {
    deploy: fis.plugin('local-deliver', {
        to: '../output-arrow-rd'
    })
})
.match('*.vm', {
    url: '/views/${namespace}$0',
    preprocessor: fis.plugin('extlang', {
        type: 'velocity'
    }),
    rExt: '.html'
});

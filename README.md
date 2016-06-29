# FMUI
FMUI(Finance Mobile UI) 移动端（Mobile）组件库

## 内容
* [环境搭建](#quick-start)
* [编译预览](#compile-preview)
* [组件列表](#widget-list)
* [组件调用](#widget-using)
* [注意事项](#attention-list)
* [文档示例](#document-demo)
* [版本更新](#version-upadate)
* [问题反馈](#question-feedback)
* [作者简介](#author-introduce)
* [版权许可](#copyright-license)

<a name="quick-start"></a>
## 环境搭建
安装node,fis3

<a name="compile-preview"></a>
## 编译&预览
```
cd fmui
// 预览
fis3 release 
// 实时预览
fis3 release -wL
// 发布
fis3 release prod
```

<a name="widget-list"></a>
## 组件列表
*   ActionSheet     上拉列表
*   Agreement       协议模板
*   Button          按钮
*   Checkbox        单复选框
*   CitySelect      省市区三级联动
*   Countdown       倒计时
*   Dialog          弹窗
*   Form            表单
*   List            列表
*   Notice          顶部通知
*   Overlay         遮罩层
*   Search          搜索框
*   Switch          滑动开关
*   Tab             Tab切换
*   Toast           Toast气泡
*   Validate        表单校验

<a name="widget-using"></a>
## 组件调用
```
// 上拉列表
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
```
```
// 省市区三级联动
$('#citySelector, #addressResident').citySelect({
    url: '/test/city',
    province: {
        data: pdata
    };
});
```
<a name="attention-list"></a>
## 注意事项
1. .tmpl文件建议以下划线开头命名，这样编译时不会产出，同时解决和同目录下与js同名时编译出现bug问题，或者在fis-conf.js中配置不产出。

<a name="document-demo"></a>
## 文档示例

<a name="version-upadate"></a>
## 版本更新
`FMUI` 的版本方针遵循 [SemVer](http://semver.org/lang/zh-CN/) 规范，版本号采用 `主版本号.次版本号.修订号` 的格式。

<a name="question-feedback"></a>
## 问题反馈
有问题可以直接提到[Issues](https://github.com/benjamin-zuo/fmui/issues/new)和[Pull Requests](https://github.com/benjamin-zuo/fmui/pulls)

<a name="author-introduce"></a>
## 作者简介
Benjamin, at Beijing
您可以在以下地方找到我： 
* [Github](https://github.com/benjamin-zuo)
* [weibo] (http://weibo.com/cuew1987) 
* [Blog](http://www.zuojj.com)


<a name="copyright-license"></a>
## 版权许可
源码和文档版权属于 [zuojj.com](http://www.zuojj.com)。源码发布基于 [MIT license](http://opensource.org/licenses/MIT) 开源协议。文档发布基于 [Creative Commons](http://creativecommons.org/licenses/by/4.0/) 开源协议。

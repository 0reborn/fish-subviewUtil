define(function() {
    var AppGlobal = {};

    function getWebRootPath() {
        var webroot = document.location.href;
        var rootpath = '';
        webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
        webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
        webroot = webroot.substring(0, webroot.indexOf('/'));
        rootpath = webroot.length <= 0 ? '' : '/' + webroot;
        return rootpath;
    }

    AppGlobal = fish.Model.extend({
        defaults: {
            currentStatus: '', // 当前的状态（login表示登录状态，running表示已经登录并且session没有过期，sessionTimeOut表示session过期，beenKickedFromLogin表示从登录状态踢出）
            language: 'zh', // 默认是英语
            charset: 'UTF-8', // 默认编码
            webroot: getWebRootPath(), // 第一次请求main.html会根据浏览器计算,后面则通过服务返回值注入进来
            version: '1.0.0', // 默认的版本信息,
            _csrf: '',
            _csrf_header: ''
        }
    });

    return new AppGlobal(); // 单例
});

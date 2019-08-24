/**
 * Copyright: Copyright 2017 ZTESOFT, Inc.
 */
define([
    'hbs!modules/home/templates/Home.html',
    'css!modules/home/css/home.css'
], function (template) {
    return fish.View.extend({
        el: false,
        template: template,
        // 提供模板数据
        serialize: {},
        // 视图事件定义
        events: {
        },
        // 一些初始化设置 (不能进行dom操作)
        initialize: function () {
        },
        // 视图渲染完毕处理函数
        afterRender: function () {
        }
    });
});

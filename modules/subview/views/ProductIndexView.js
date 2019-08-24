/**
 * Title: subview.js
 * Description: subview.js
 * Copyright: Copyright 2016 ZTESOFT, Inc.
 */
define([
   'hbs!modules/subview/templates/ProductIndexView.html',
   'i18n!modules/subview/i18n/Subview.i18n',
   
], function(tpl, i18n) {
   var me = null;
   return fish.View.extend({
       el: false,
       template: tpl,
       // i18nData: fish.extend({}, i18n, commonI18n),
       i18nData: fish.extend({}, i18n),
       // 提供模板数据
       serialize: function () {
           return this.i18nData;
       },
       // 视图事件定义
       events: {},
       // 一些初始化设置 (不能进行dom操作)
       initialize: function() {
           me = this;
           console.log(me);
       },
       // 视图渲染完毕处理函数
       afterRender: function() {
       },
       // 视图被删除时候做的事情
       cleanup: function() {
           me = null;
       }
   });
});

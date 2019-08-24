/**
 * Title: subview.js
 * Description: subview.js
 * Copyright: Copyright 2016 ZTESOFT, Inc.
 */
define([
   'hbs!modules/subview/templates/Subview.html',
   'i18n!modules/subview/i18n/Subview.i18n',
   'frm/portal/common/viewUtils',
   'css!../css/index.css'
], function (tpl, i18n, viewUtils) {
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
      initialize: function () {
      },
      // 视图渲染完毕处理函数
      afterRender: function () {
         var me = this;

         // 根据场景编码渲染子视图
         viewUtils.renderView({
            sceneCode: 'Customer',  // 场景编码
            selector: '.js-main',   // 父视图div
            parentView: this        // 父视图
         }).then(function (subviews) {
            // 子视图渲染完毕后，遍历子视图数组，根据不同类型来进行个性化的操作
            fish.each(subviews, function (view) {
               if (view.type === 'grid') {
                  // 如果为grid，则可以在外部绑定onSelectRow事件（子视图选中某一行，外部可以感知到）
                  view.self.onSelectRow(function (rowdata) {
                     console.log(rowdata)
                  });
               } else if (view.type === 'form') {
                  // 如果为form，可以通过view.self上面绑定的方法来获取表单的key和object
                  var key = view.self.getKey();
                  var formObject = view.self.toFormObject();
               }
            });
         });
      },
      // 视图被删除时候做的事情
      cleanup: function () {
         me = null;
      }
   });
});

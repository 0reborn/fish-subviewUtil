/* eslint-disable*/
define(function () {

   // 模拟后端返回的数据
   var data = {
      // 一个场景编码对应一个子视图数组
      "Customer": [
         {
            url: 'modules/subview/views/CustomerFormView',  // 子视图URL
            type: 'form',  // 子视图类型：'form'或者'grid'
            key: 'custInfo'   // 表单json对象的key
         },
         {
            url: 'modules/subview/views/CustomerGridView',
            type: 'grid',
         }
      ],
      "Product": [

      ]
   }

   return {
      renderView: function (option) {

         var sceneCode = option.sceneCode;   // 场景编码
         var selector = option.selector;     // jq选择器
         var parentView = option.parentView; // 父视图实例

         var promises = [];
         var subviews = [];

         fish.each(data[sceneCode], function (each) {
            var p = function () {
               return parentView.requireView({
                  url: each.url,
                  selector: selector,
                  insert: 'true',
                  callback: function (subview) {
                     subviews.push({
                        self: subview,
                        type: each.type
                     });
                  }
               });
            }
            promises.push(p);
         });

         return $.series(promises).then(function () {
            parentView.subviews = subviews;
            return parentView.subviews;
         })
      }
   };
});

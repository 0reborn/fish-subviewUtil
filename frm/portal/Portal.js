/* eslint-disable*/
define([
    'frm/portal/AppGlobal',
    'frm/portal/Utils.js',
    "frm/portal/RestAPIHelper"
], function(appGlobal, utils) {
    //将几个公共模块挂到fish对象上面
    var FishView = fish.View,
        PortalDef = function() {
            this.appGlobal = appGlobal;
            this.promise = {};
        };

    window.portal = new PortalDef();
    window.portal.utils = utils;

    /**
     * @method fish.View
     * 返回fish.View实例,重写其中的initialize,resize,setElement方法
     */
    fish.View = (function() {
    	var adviceFuncs = {
    		initialize: function(func) { return function() {
				func.apply(this, arguments);
				this.on('render', function() {
				    var isloadfileupload = portal.appGlobal.get("_csrf")
                        && $.blueimp && $.blueimp.fileupload
                        && !$.blueimp.fileupload.prototype.options.csrf;
				    if(isloadfileupload){
				        var headers = $.blueimp.fileupload.prototype.options.headers || {};
                        headers[portal.appGlobal.get("_csrf_header")] = portal.appGlobal.get("_csrf");
                        $.blueimp.fileupload.prototype.options.headers = headers;
                        // $.blueimp.fileupload.prototype.options.csrf = portal.appGlobal.get("_csrf");
                        // $.blueimp.fileupload.prototype.options.csrfHeader = portal.appGlobal.get("_csrf_header");
                    }
				}, this);
				this.on('afterRender', function(){
					//菜单加载完成,会触发resize事件,会执行到menuresize方法;因此这里菜单的就不再执行了
					//workspace菜单没有tabs__content样式,但也没有resize方法,这里不做考虑
					if(!this.$el.hasClass("tabs__content")) {
						this.resize(portal.utils.getDeltaHeight(this.$el));
					}
				}, this);
			}},
			resize: function(func) {return function(delta) {
				func.call(this, delta);
				fish.each(this.__manager__.views, function (views) {
					fish.each($.makeArray(views), function (view) {
						if (view.$el.is(':visible')) {
							if (fish.isFunction(view.resize)) {
								var delta = view.$el.parent().height() - view.$el.outerHeight(true);
								view.resize(delta);
							}
						}
					}, this);
				}, this);
			}}
    	}
    	return FishView.extend({
    		resize: $.noop
    	}, {
    		extend: function (protoProps, staticProps) {
    			var parent = this;

    			protoProps = protoProps || {};

    			// here do advice for functions that framework interests
    			$.each(adviceFuncs, function(funcName, adviceFunc) {
    				var func = protoProps[funcName] || parent.prototype[funcName];
    				protoProps[funcName] = adviceFunc(func);
    			});

    			return FishView.extend(protoProps, staticProps);
    		}
    	});
    })();

    //版本更新时，解决require缓存问题
    require.config({
        urlArgs: 'v=' + portal.appGlobal.get('version')
    });


    fish.utils = utils;
});

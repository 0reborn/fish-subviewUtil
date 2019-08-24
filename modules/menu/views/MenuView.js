define([
    'hbs!modules/menu/templates/MenuTpl.html',
    'modules/menu/collections/menu',
    'frm/fish-desktop/third-party/pagesidebar/fish.pagesidebar',
    'css!frm/fish-desktop/third-party/pagesidebar/pagesidebar.css',
    'css!../css/menu.css'
], function (MenuTpl, menuData) {
    return fish.View.extend({
        serialize: {},
        // 提供模板数据
        template: MenuTpl,
        // 视图事件定义
        events: {},
        // 一些初始化设置 (不能进行dom操作)
        initialize: function () { },
        // 视图渲染完毕处理函数
        afterRender: function () {
            this.renderPageSider();
            this.changeMenu(menuData[0].url);
            $('.ui-sidebar-menu>li:first-child').addClass('active');
        },
        renderPageSider: function () {
            var that = this;
            var $closed;
            this.pagesidebar = this.$('.side-menu').pagesidebar({
                data: menuData,
                children: 'children',
                zIndex: 1000,
                minWidth: 50,
                width: 230,
                openFirst: true,
                subMenuMode: 'inline',
                select: function (e, data) {
                    if (e && e.currentTarget && data.url) {
                        that.changeMenu(data.url);
                    }
                }
            });
            // 隐藏pageSideBar组件自带的收缩按钮
            this.$('.ui-sidebar-toggler-wrapper').hide();
            $('.menu-logo').on(
                'click',
                function () {
                    this.pagesidebar.find('.ui-sidebar-toggler').trigger('click');
                    $closed = $('.ui-sidebar-menu-closed');
                    if ($closed.length > 0) {
                        $('#MainBox').css('margin-left', '50px');
                    } else {
                        $('#MainBox').css('margin-left', '230px');
                    }
                    $(window).trigger('resize');
                }.bind(this)
            );
        },
        changeMenu: function (url) {
            this.requireView({
                url: url,
                selector: '#MainBox'
            });
        }
    });
});

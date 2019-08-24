fish.View.configure({ manage: true, syncRender: true });
require(['frm/portal/Portal'], function() {
    fish.setLanguage(window.portal.appGlobal.get('language'));

    require(['modules/menu/views/MenuView'], function(MenuView) {
        new MenuView({
            el: $('#app') // 主视图选择器
        }).render();
    });
});

/* eslint-disable */
// type：0 目录;type：1 菜单;id、parentId依赖关系
define(function () {
	return [
    {
        "id": "0",
        "title": "Home",
        "url": "modules/home/views/Home",
        "type": "1",
        "icon": "glyphicon glyphicon glyphicon-user"
    },
    {
        "id": "1",
        "title": "Test",
        "type": "1",
        "url": "modules/test/views/Test",
        "icon": "glyphicon glyphicon-asterisk"
    },
    {
        "id": "2",
        "title": "Subview",
        "type": "1",
        "url": "modules/subview/views/Subview",
        "icon": "glyphicon glyphicon-asterisk"
    }
]
});
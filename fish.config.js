// 详细配置信息请参考http://gitlab.ztesoft.com/fish/fish-cli/wikis/fish-config
module.exports = {
    devServer: {
        port: 9088,
        contentBase: '',
        proxy: [
            {
                match: ['/**', '!/LESS/**/**', '!/image/**', '!/frm/**', '!/styles/**', '!/modules/**', '!/i18n/**', '!/index.html', '!/main.js'],
                target: 'https://mock.iwhalecloud.com/mock/1659',
                changeOrigin: true, // 可跨域
                logLevel: 'debug' // 打印被代理url的信息
            }
        ]
    }
};

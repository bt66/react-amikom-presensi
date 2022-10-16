const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/pweb',
        createProxyMiddleware({
            target: 'http://localhost:3001/',
            changeOrigin: true,
            pathRewrite: {
                '^/pweb': '/'
            }
        })
    );
    app.use(
        '/presensi',
        createProxyMiddleware({
            target: 'http://202.91.9.14:6000/',
            changeOrigin: true,
            pathRewrite: {
                '^/presensi': '/'
            }
        })
    );
};
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/amikomone',
        createProxyMiddleware({
            target: 'https://ds.amikom.ac.id/',
            changeOrigin: true,
        })
    );
};
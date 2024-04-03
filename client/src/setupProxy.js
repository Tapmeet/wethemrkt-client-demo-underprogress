const { createProxyMiddleware } = require('http-proxy-middleware');
const proxySetting = process.env.REACT_APP_URL || require(paths.appPackageJson).proxy;
module.exports = function(app) {
  // target: 'http://172.105.9.155:8080/'
  // changeOrigin: true

 // target: 'http://localhost:8080/',
 // changeOrigin: false,

 //    target: 'http://139.59.27.47:8081/'
 //http://139.59.27.47:8081
  app.use(
    '/api/*',
    createProxyMiddleware({
    target: proxySetting,
    changeOrigin: false
    })
  );
};
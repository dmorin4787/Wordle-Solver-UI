const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/wordlesolver/rest',
    createProxyMiddleware({
      target: 'https://app-1lru.onrender.com',
      changeOrigin: true,
    })
  )
}
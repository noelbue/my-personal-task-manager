const { defineConfig } = require('@vue/cli-service')

/**
 * Vue CLI Configuration
 * @type {import('@vue/cli-service').ConfigFunction}
 */
module.exports = defineConfig({
  transpileDependencies: true,
  /**
   * Development server configuration
   * Proxies API requests to the backend server during development
   */
  devServer: {
    proxy: 'http://localhost:3000',
  },
})
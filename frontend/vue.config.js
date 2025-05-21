const { defineConfig } = require('@vue/cli-service');
const nodeExternals = require('webpack-node-externals');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  chainWebpack: (config) => {
    if (process.env.SSR) {
      config.entry('app').clear().add('./src/entry-server.js');
      config.target('node');
      config.output.libraryTarget('commonjs2');
      config.externals([nodeExternals]);
      config.plugin('define').tap((args) => {
        args[0]['process.env.VUE_ENV'] = '"server"';
        return args;
      });
    }
  },
});

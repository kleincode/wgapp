module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
  },
  configureWebpack: {
    devtool: "eval-source-map"
  },
  devServer: {
    port: 9000,
    open: true
  }
};

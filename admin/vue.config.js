module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.module
      .rule("eslint")
      .use("eslint-loader")
      .options({
        fix: true
      });
  },
  devServer: {
    proxy: {
      "/_/*": {
        target: "http://localhost:3001",
        secure: false
      }
    }
  },
};

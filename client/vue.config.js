module.exports = {
  pwa: {
    name: "WG App",
    themeColor: "#463ABB",
    msTileColor: "#463ABB",
    manifestOptions: {
      background_color: "#463ABB"
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "public/service-worker.js"
    }
  },
  devServer: {
    proxy: {
      "/_/*": {
        target: "http://localhost:3001",
        secure: false
      }
    }
  },
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.module
      .rule("eslint")
      .use("eslint-loader")
      .options({
        fix: true
      });
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;
    } else {
      config.devtool = "eval-source-map";
    }
  }
};

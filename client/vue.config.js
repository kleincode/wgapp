module.exports = {
  pwa: {
    name: "WG App",
    themeColor: "#463ABB",
    msTileColor: "#463ABB",
    manifestOptions: {
      background_color: "#463ABB"
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
};

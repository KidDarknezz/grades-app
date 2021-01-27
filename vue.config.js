module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },
  transpileDependencies: ["quasar"],
  pwa: {
    name: "My Grades",
    short_name: "My Grades",
    themeColor: "#fff",
    msTileColor: "#fff",
    backgroundColor: "#ffffff",
    manifestOptions: {
      icons: [
        {
          src: "img/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "img/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
};

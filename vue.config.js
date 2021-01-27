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
    themeColor: "#000",
    msTileColor: "#000000",
    backgroundColor: "#ffffff",
    manifestOptions: {
      icons: [
        {
          src: "@/assets/icon-512.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "@/assets/icon-192.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
};

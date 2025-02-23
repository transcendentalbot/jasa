module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: ["expo-router/babel"], // ✅ Keep only Expo Router if you're using it
    };
  };
  
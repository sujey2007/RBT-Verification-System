module.exports = function (api) { api.cache(true); return { presets: ['babel-preset-expo'], plugins: ['expo-router/babel'] }; }; 
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for Expo Router to work correctly
      'expo-router/babel',
    ],
  };
};
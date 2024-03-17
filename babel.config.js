module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    'module:react-native-dotenv'
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};

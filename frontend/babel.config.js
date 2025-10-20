// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: 'defaults', 
      modules: false, 
    }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      helpers: true,
      regenerator: true,
      useESModules: true, 
    }]
  ],
  sourceType: 'module', 
};

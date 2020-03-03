module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    'eslint:recommended'
  ],
  rules: {
    // allow console during development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    // 缩进
    'indent': 0,
    'camelcase': 'off',
    // "quotes": "avoid-escape"
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

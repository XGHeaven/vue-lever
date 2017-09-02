import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

let pkg = require('./package.json')

let plugins = [babel(babelrc())]

export default {
  input: 'src/lever.js',
  plugins: plugins,
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'VueLever',
    sourcemap: true,
  },
}

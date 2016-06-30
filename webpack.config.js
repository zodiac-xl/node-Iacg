require('babel-core/register');
require("babel-polyfill");
var config = require('./config/webpack/webpack.config');
module.exports = config;

/**
 * Created by E84266 on 2/27/2017.
 */

var _ = require("lodash");
var defaultConfig = require("./default.js");
var config = require("./" + (process.env.NODE_ENV || "development") + ".js");

module.exports = _.merge({}, defaultConfig, config);
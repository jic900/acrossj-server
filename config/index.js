/**
 * Created by E84266 on 2/27/2017.
 */

const _ = require("lodash");
const defaultConfig = require("./default.js");
const config = require("./" + (process.env.NODE_ENV || "development") + ".js");

module.exports = _.merge({}, defaultConfig, config);
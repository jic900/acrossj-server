/**
 * Created by LAE84266 on 28/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const errors = require('properties-reader')(APP_BASE + '/resources/errors.properties');

exports.get = (key, valueArgs) => {
  let value = errors.get(key);
  if (valueArgs && valueArgs instanceof Array) {
    for (let index in valueArgs) {
      value = value.replace(`{${index}}`, valueArgs[index]);
    }
  }
  return value;
}
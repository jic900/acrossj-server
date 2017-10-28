/**
 * Created by E86643 on 8/12/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const errors = require('properties-reader')(APP_BASE + '/resources/errors.properties');

logger.debug('Initializing model.profile');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Relevant = new Schema({
  general: Schema.Types.Mixed,
  ski: Schema.Types.Mixed,
  hiking: Schema.Types.Mixed,
  running: Schema.Types.Mixed,
  bicycling: Schema.Types.Mixed,
  camping: Schema.Types.Mixed,
  others: Schema.Types.Mixed
}, {_id: false});

const Profile = new Schema({
  _userid: {type: Number, unique: true},
  personal: Schema.Types.Mixed,
  relevant: Relevant,
  transportation: Schema.Types.Mixed,
  group: Schema.Types.Mixed
});

const uniqueValidator = require(APP_BASE + '/db/db').uniqueValidator;
Profile.plugin(uniqueValidator);

Profile.statics = {
  createProfile: function (requestData, callback) {
    this.create(requestData, callback);
  },
  updateProfile: function (request, callback) {
    this.findOneAndUpdate({'_userid': request.ACROSSJ_PARAMS._id}, {'$set': request.body}, {'new': true}, callback);
  },
  findProfile: function (query, callback) {
    this.findOne(query, callback);
  },
  findProfileByUserId: function (userid, callback) {
    this.findOne({_userid: userid}, callback);
  }
}

const profile = mongoose.model('profile', Profile);

module.exports = profile;
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

const Personal = new Schema({
  fullname: String,
  gender: String,
  birthday: Date,
  address: String,
  postcode: String,
  phonenumber: String

}, {_id: false});

const GeneralInfo = new Schema({
  languages: [],
  manage_skill: String,
  shoe_size: Number,
  T_Shirt_size: String,
  height: Number,
  weight: Number
}, {_id: false});

const SkiInfo = new Schema({
  level: Number,
  type: String,
  license: String,
  jacket_size: Number,
  pants_size: Number
}, {_id: false});

const HikingInfo = new Schema({
  info: [Schema.Types.Mixed]
}, {_id: false});

const RunningInfo = new Schema({
  info: [Schema.Types.Mixed]
}, {_id: false});

const BicyclingInfo = new Schema({
  info: [Schema.Types.Mixed]
}, {_id: false});

const CampingInfo = new Schema({
  info: [Schema.Types.Mixed]
}, {_id: false});

const OthersInfo = new Schema({
  info: [Schema.Types.Mixed]
}, {_id: false});

const Relevant = new Schema({
  general: GeneralInfo,
  ski: SkiInfo,
  hiking: HikingInfo,
  running: RunningInfo,
  bicycling: BicyclingInfo,
  camping: CampingInfo,
  others: OthersInfo
}, {_id: false});

const Profile = new Schema({
  _userid: {type: Number, unique: true},
  personal: Personal,
  relevant: Relevant,
  group: [Schema.Types.Mixed]
});

const uniqueValidator = require(APP_BASE + '/db/db').uniqueValidator;
Profile.plugin(uniqueValidator);

Profile.statics = {
  createProfile: function (requestData, callback) {
    this.create(requestData, callback);
  },
  updateProfile: function (request, callback) {
    this.findOneAndUpdate({'_userid': request.ACROSSJ_PARAMS.userId}, {'$set': request.body}, {'new': true}, callback);
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
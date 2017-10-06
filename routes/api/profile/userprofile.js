/**
 * Created by E86643 on 8/14/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const httpStatus = require('http-status-codes');
const router = require('express').Router();
const Profile = require(APP_BASE + '/models/profile');

const saveUserProfile = (req, res, next) => {
  Profile.updateProfile(req, (err, profile) => {
    if (err) {
      next(util.getError('saveUserProfile', httpStatus.INTERNAL_SERVER_ERROR, err, null));
    } else {
      res.json(profile);
    }
  });
}

const getUserProfile = (req, res, next) => {
  const userId = req.ACROSSJ_PARAMS.userId;
  Profile.findProfileByUserId(userId, (err, profile) => {
    if (err) {
      next(util.getError('getUserProfile', httpStatus.INTERNAL_SERVER_ERROR, err, null));
    } else if (!profile) {
      Profile.createProfile({_userid: userId}, (err, newprofile) => {
        if (err) {
          next(util.getError('createUserProfile', httpStatus.INTERNAL_SERVER_ERROR, err, null));
        } else {
          res.json(newprofile);
        }
      });
    } else {
      res.json(profile);
    }
  });
}

router.route('/').get(getUserProfile);
router.route('/').post(saveUserProfile);

module.exports = router;
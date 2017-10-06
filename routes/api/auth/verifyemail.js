/**
 * Created by LAE84266 on 22/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const httpStatus = require('http-status-codes');
const router = require('express').Router();
const User = require(APP_BASE + '/models/user');
const verifyToken = require(APP_BASE + '/middlewares/verify-token');
const findUserBy = require(APP_BASE + '/middlewares/find-user-by');

const verifyUser = (req, res, next) => {
  const user = req.ACROSSJ_PARAMS.user;
  if (user.isVerified === true) {
    res.json({status: 'AlreadyVerified', message: 'Account already verified'});
  } else {
    user.isVerified = true;
    User.updateUser(user, (err, user) => {
      if (err) {
        next(util.getError('UpdateUser', httpStatus.INTERNAL_SERVER_ERROR, err, null));
      } else {
        res.json({status: 'Verified', message: 'Account successfully verified'});
      }
    });
  }
};

router.route('/').post(verifyToken, findUserBy('username'), verifyUser);

module.exports = router;
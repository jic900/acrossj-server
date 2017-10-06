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

const resetPassword = (req, res, next) => {
  const user = req.ACROSSJ_PARAMS.user;
  user.password = req.body.newPassword;
  User.updatePassword(user, (err, user) => {
    if (err) {
      next(util.getError('UpdatePassword', httpStatus.INTERNAL_SERVER_ERROR, err, null));
    } else {
      res.json({status: httpStatus.OK});
    }
  })
}

router.route('/').post(verifyToken, findUserBy('username'), resetPassword);

module.exports = router;
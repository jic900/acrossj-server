/**
 * Created by LAE84266 on 22/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const httpStatus = require('http-status-codes');
const router = require('express').Router();
const User = require(APP_BASE + '/models/user');
const findUserBy = require(APP_BASE + '/middlewares/find-user-by');

const changePassword = (req, res, next) => {
  const user = req.ACROSSJ_PARAMS.user;
  const currentPassword = util.decrypt(user.password);
  if (req.body.currentPassword && req.body.currentPassword !== currentPassword) {
    err = {message: 'The current password entered is incorrect'};
    next(util.getError('InvalidPassword', httpStatus.UNAUTHORIZED, err, null));
  } else if (req.body.currentPassword && req.body.currentPassword === req.body.newPassword) {
    err = {message: 'The new password cannot be the same as the current password'};
    next(util.getError('SamePassword', httpStatus.UNPROCESSABLE_ENTITY, err, null));
  } else {
    user.password = req.body.newPassword;
    User.updatePassword(user, (err, user) => {
      if (err) {
        next(util.getError('UpdatePassword', httpStatus.INTERNAL_SERVER_ERROR, err, null));
      } else {
        res.json({status: httpStatus.OK});
      }
    })
  }
}

router.route('/').post(findUserBy('_id'), changePassword);

module.exports = router;
/**
 * Created by LAE84266 on 22/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const authUtil = require(APP_BASE + '/utils/auth-util');
const httpStatus = require('http-status-codes');
const router = require('express').Router();
const User = require(APP_BASE + '/models/user');

const createUser = (req, res, next) => {
  User.createUser(req.body, (err, user) => {
    if (err) {
      if (err.name === 'ValidationError') {
        next(util.getError('Validation', httpStatus.UNPROCESSABLE_ENTITY, err, 'user'), null);
      } else {
        next(util.getError('CreateUser', httpStatus.INTERNAL_SERVER_ERROR, err, null), null);
      }
    } else {
      req.ACROSSJ_PARAMS.user = user;
      next();
    }
  });
}

const sendVerifyEmail = (req, res, next) => {
  const user = req.ACROSSJ_PARAMS.user;
  const tokenData = {
    username: user.username
  };
  const token = authUtil.createToken(tokenData);
  authUtil.sendVerifyMail(user, token, req.body.lang, (err, result) => {
    if (err) {
      next(util.getError('SendVerifyMail', httpStatus.FORBIDDEN, err, null), null);
    } else {
      res.json({status: httpStatus.OK});
    }
  });
}

router.route('/').post(createUser, sendVerifyEmail);

module.exports = router;
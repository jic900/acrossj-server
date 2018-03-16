/**
 * Created by LAE84266 on 07/08/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const authUtil = require(APP_BASE + '/utils/auth-util');
const httpStatus = require('http-status-codes');
const router = require('express').Router();
const User = require(APP_BASE + '/models/user');

router.route('/').post((req, res, next) => {
  const tokenData = {
    username: req.body.username
  };
  res.json({token: authUtil.createToken(tokenData)});
});

module.exports = router;
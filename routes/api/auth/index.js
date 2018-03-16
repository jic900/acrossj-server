/**
 * Created by LAE84266 on 24/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const router = require('express').Router();

router.use('/signup', require(APP_BASE + '/routes/api/auth/signup'));
router.use('/signin', require(APP_BASE + '/routes/api/auth/signin'));
router.use('/verifyemail', require(APP_BASE + '/routes/api/auth/verifyemail'));
router.use('/forgotpassword', require(APP_BASE + '/routes/api/auth/forgotpassword'));
router.use('/resetpassword', require(APP_BASE + '/routes/api/auth/resetpassword'));
router.use('/sendverifyemail', require(APP_BASE + '/routes/api/auth/sendverifyemail'));
router.use('/refreshtoken', require(APP_BASE + '/routes/api/auth/refreshtoken'));

module.exports = router;
/**
 * Created by LAE84266 on 24/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const router = require('express').Router();
const authenticate = require(APP_BASE + '/middlewares/authenticate');

router.use('/changepassword', authenticate, require(APP_BASE + '/routes/api/profile/changepassword'));
router.use('/userprofile', authenticate, require(APP_BASE + '/routes/api/profile/userprofile'));

module.exports = router;
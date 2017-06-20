/**
 * Created by LAE84266 on 15/06/2017.
 */

'use strict';

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const express = require('express');
const router = express.Router();
const auth = require(APP_BASE + '/routes/auth/auth');

router.route('/signup')
    .post(function(req, res, next) {
        logger.debug(req);
        res.json({status: 'good'});
        // auth.signUp(req, res);
    });

router.route('/signin')
    .post(function(req, res, next) {

    });

router.route('/forgotPassword')
    .post(function(req, res, next) {

    });

router.route('/verifyEmail')
    .get(function(req, res, next) {

    });

router.route('/resetPassword')
    .post(function(req, res, next) {

    });

module.exports = router;

// module.exports = function(app){
//     app.post('/signUp', auth.signUp);
//     app.post('/signIn', auth.signIn);
//     app.post('/forgotPassword', auth.forgotPassword);
//     app.post('/resetPassword', auth.resetPassword);
//     app.get('/verifyEmail', auth.verifyEmail);
// }
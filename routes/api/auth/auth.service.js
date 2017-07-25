/**
 * Created by LAE84266 on 24/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const config = require(APP_BASE + '/config');
const util = require(APP_BASE + '/utils/util');
const jwt = require('jsonwebtoken');

exports.createToken = (tokenData) => {
    tokenData.exp = Math.floor(Date.now() / 1000) + config.JWT.TOKEN_EXPIRY;
    return jwt.sign(tokenData, config.JWT.PRIVATE_KEY);
    // return jwt.sign(tokenData, config.JWT.PRIVATE_KEY, {expiresIn: config.JWT.TOKEN_EXPIRY});
}

exports.verifyToken = (token, callback) => {
    jwt.verify(token, config.JWT.PRIVATE_KEY, callback);
}

exports.sendVerifyMail = (user, token, lang, callback) => {
    // TODO - create verify email based on language
    const verifyLink = "http://" + config.SERVER.DOMAIN_HOST + ":" + config.SERVER.DOMAIN_PORT + "/" + config.EMAIL.VERIFY_EMAIL_URL + "?token=" + token;
    const from = `ACrossJ Admin<${config.EMAIL.USER}>`;
    const mailbody = `
        <p>Hi ${user.username},</p>
        <br/>
        <p>Thanks for Registering. Please verify your email by clicking on the verification link below. The link will expire in ${config.JWT.TOKEN_EXPIRY}.</p>
        <br/>
        <a href=${verifyLink.toString()}>Verification Link</a>`;
    util.mail(from, user.email, `Account Verification`, mailbody, function(error, success) {
        callback(error, success);
    });
};

exports.sendResetPasswordMail = (user, token, lang, callback) => {
    // TODO - create resetpassword email based on language
    const resetPasswordLink = "http://" + config.SERVER.DOMAIN_HOST + ":" + config.SERVER.DOMAIN_PORT + "/" + config.EMAIL.RESET_PASSWORD_URL + "?token=" + token;
    const from = `ACrossJ Admin<${config.EMAIL.USER}>`;
    const mailbody = `
        <p>Hi ${user.username},</p>
        <br/>
        <p>Please reset your password by clicking on the link below. The link will expire in ${config.JWT.TOKEN_EXPIRY}.</p>
        <br/>
        <a href=${resetPasswordLink.toString()}>Reset Password Link</a>`;
    util.mail(from, user.username , `Account Reset Password`, mailbody, function(error, success){
        callback(error, success);
    });
};
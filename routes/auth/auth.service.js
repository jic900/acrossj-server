/**
 * Created by LAE84266 on 15/06/2017.
 */

'use strict';

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const config = require(APP_BASE + '/config');
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
// const crypto = require('crypto');
// const algorithm = 'aes-256-ctr';
// const privateKey = config.JWT.PRIVATE_KEY;


const xoauth2gen = xoauth2.createXOAuth2Generator({
    user: config.EMAIL.USER,
    clientId: config.EMAIL.CLIENT_ID,
    clientSecret: config.EMAIL.CLIENT_SECRET,
    refreshToken: config.EMAIL.REFRESH_TOKEN
});

xoauth2gen.on('token', function(token){
    logger.debug('New token for %s: %s', token.user, token.accessToken);
});

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2gen
    }
});

// create reusable transport method (opens pool of SMTP connections)
// const smtpTransport = nodemailer.createTransport("SMTP", {
//     service: "Gmail",
//     auth: {
//         // type: 'OAuth2',
//         user: config.EMAIL.ADDRESS,
//         // user: config.EMAIL.USERNAME,
//         pass: config.EMAIL.PASSWORD
//     }
// });


// var smtpTransport = nodemailer.createTransport("SMTP", {
//     service: "Gmail",
//     auth: {
//         XOAuth2: {
//             user: "your_email_address@gmail.com", // Your gmail address.
//                                                   // Not @developer.gserviceaccount.com
//             clientId: "your_client_id",
//             clientSecret: "your_client_secret",
//             refreshToken: "your_refresh_token"
//         }
//     }
// });



// var smtpTransport = nodemailer.createTransport("smtps://youruser%40gmail.com:"+encodeURIComponent('yourpass#123') + "@smtp.gmail.com:465");


// exports.decrypt = (password) => {
//     const decipher = crypto.createDecipher(algorithm, privateKey);
//     let dec = decipher.update(password, 'hex', 'utf8');
//     dec += decipher.final('utf8');
//     return dec;
// };
//
// exports.encrypt = (password) => {
//     const cipher = crypto.createCipher(algorithm, privateKey);
//     let crypted = cipher.update(password.toString(), 'utf8', 'hex');
//     crypted += cipher.final('hex');
//     return crypted;
// };

exports.sendVerifyMail = (user, token, lang, callback) => {
    const verifyLink = "http://" + config.SERVER.DOMAIN_HOST + ":" + config.SERVER.DOMAIN_PORT + "/" + config.EMAIL.VERIFY_EMAIL_URL + "?verifyToken=" + token;
    const from = `ACrossJ Admin<${config.EMAIL.USER}>`;
    const mailbody = `
        <p>Hi ${user.username},</p>
        <br/>
        <p>Thanks for Registering. Please verify your email by clicking on the verification link below. The link will expire in ${config.JWT.TOKEN_EXPIRY}.</p>
        <br/>
        <a href=${verifyLink.toString()}>Verification Link</a>`;
    mail(from, user.email, `Account Verification`, mailbody, function(error, success) {
        callback(error, success);
    });
};

exports.sendResetPasswordMail = (user, token, lang, callback) => {
    const resetPasswordLink = "http://" + config.SERVER.DOMAIN_HOST + ":" + config.SERVER.DOMAIN_PORT + "/" + config.EMAIL.RESET_PASSWORD_URL + "/" + token;
    const from = `ACrossJ Admin<${config.EMAIL.USER}>`;
    const mailbody = `
        <p>Hi ${user.username},</p>
        <br/>
        <p>Please reset your password by clicking on the link below. The link will expire in ${config.JWT.TOKEN_EXPIRY}.</p>
        <br/>
        <a href=${resetPasswordLink.toString()}>Reset Password Link</a>`;
    mail(from, user.username , `Account Reset Password`, mailbody, function(error, success){
        callback(error, success);
    });
};

function mail(from, email, subject, mailbody, callback){
    const mailOptions = {
        from: from,
        to: email, // list of receivers
        subject: subject,
        html: mailbody
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            callback(error, null);
        } else{
            callback(null, response);
        }
        smtpTransport.close();
    });
}
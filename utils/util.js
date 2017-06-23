/**
 * Created by LAE84266 on 18/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const config = require(APP_BASE + '/config');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const errors = require('properties-reader')(APP_BASE + '/resources/errors.properties');
const algorithm = 'aes-256-ctr';
const privateKey = config.JWT.PRIVATE_KEY;

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config.EMAIL.USER,
        clientId: config.EMAIL.CLIENT_ID,
        clientSecret: config.EMAIL.CLIENT_SECRET,
        refreshToken: config.EMAIL.REFRESH_TOKEN
    }
});

exports.mail = (from, email, subject, mailbody, callback) => {
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

exports.decrypt = (value) => {
    const decipher = crypto.createDecipher(algorithm, privateKey);
    let dec = decipher.update(value, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.encrypt = (value) => {
    const cipher = crypto.createCipher(algorithm, privateKey);
    let crypted = cipher.update(value.toString(), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.getError = (name, statusCode, err, schema) => {
    if (name === 'ValidationError') {
        resetUniqueValidationError(err, schema);
    }
    err.name = name;
    return {
        status: statusCode,
        error: err
    };
}

function resetUniqueValidationError(err, schema) {
    if (err.name === 'ValidationError' && err.errors) {
        const field = Object.keys(err.errors)[0];
        const error = err.errors[field];
        if (error.kind === 'unique') {
            const errorKey = `validation.${schema}.${field}.unique`;
            error.message = errors.get(errorKey);
        }
    }
}
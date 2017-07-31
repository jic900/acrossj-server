/**
 * Created by LAE84266 on 28/07/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');

module.exports = {
    // origin: function (origin, callback) {
    //     if (config.SERVER.CORS_WHITELIST.indexOf(origin) !== -1) {
    //         callback(null, true);
    //     } else {
    //         callback(new Error('Not allowed by CORS'));
    //     }
    // }
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders: 'Accept, Content-Type, Authorization, X-Requested-With',
    maxAge: 86400
}
/**
 * Created by E84266 on 2/24/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
logger.debug('Loading routes');

const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Welcome to ACrossJ');
});

router.use('/auth', require(APP_BASE + '/routes/auth'));

const fs = require('fs');
fs.readdirSync(APP_BASE + '/routes/api').forEach(function(name){
    const entity = name.substring(0, name.indexOf('.'));
    router.use('/api/' + entity, require(APP_BASE + '/routes/api/' + entity));
});

module.exports = router;

// module.exports = function(router) {
//
//     const APP_BASE = process.env.NODE_PATH;
//     const logger = require(APP_BASE + '/utils/logger')(module.filename);
//     logger.debug('Loading routes');
//
//     router.get('/', function(req, res, next) {
//         res.send('Welcome to ACrossJ');
//     });
//
//     router.use('/auth', require(__dirname + '/auth/auth.routes')());
//
//
//     const fs = require('fs');
//     fs.readdirSync(__dirname + '/api').forEach(function(name){
//         const entity = name.substring(0, name.indexOf('.'));
//         app.use('/' + entity, require(__dirname + '/api/' + entity));
//     });
//
// //app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
// };
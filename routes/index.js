/**
 * Created by E84266 on 2/24/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const router = require('express').Router();

router.get('/', function(req, res, next) {
    res.send('Welcome to ACrossJ');
});

// initialize request params for this application
router.use((req, res, next) => {
    req.ACROSSJ_PARAMS = {};
    next();
});

const fs = require('fs');
fs.readdirSync(APP_BASE + '/routes/api').forEach(function(name){
    const entity = name.indexOf('.') !== -1 ? name.substring(0, name.indexOf('.')) : name;
    logger.debug('Initializing ' + entity);
    router.use('/api/' + entity, require(APP_BASE + '/routes/api/' + entity));
});

module.exports = router;


// app.get('/something', [express.bodyParser(), jwtauth], function(req, res){
//     // do something
// });
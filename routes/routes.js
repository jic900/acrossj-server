/**
 * Created by E84266 on 2/24/2017.
 */

module.exports = function (app) {

    var APP_BASE = process.env.NODE_PATH;
    var logger = require(APP_BASE + '/utils/logger')(module.filename);
    logger.debug('Loading APIs');

    app.get('/', function(req, res, next) {
        res.send('Welcome to ACrossJ');
    });

    app.post('/login', require(__dirname + '/auth'));

    var fs = require('fs');
    fs.readdirSync(__dirname + '/api').forEach(function(name){
        var entity = name.substring(0, name.indexOf('.'));
        app.use('/' + entity, require(__dirname + '/api/' + entity));
    });

//app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
};
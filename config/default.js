/**
 * Created by E84266 on 2/24/2017.
 */

module.exports = {
    APP_PORT : 10007,
    PM2_CONFIG_FILE : process.cwd() + '/ecosystem.config.js',
    DB_URL : 'mongodb://localhost:27017/acrossj',
    LOG_DIR : process.cwd() + '/logs',
    LOG_FILE_LEVEL : 'info',
    LOG_CONSOLE_LEVEL : 'info',
    ACCESS_LOG_FORMAT : ':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time :res[content-length]',
    NODE_ENV : process.env.NODE_ENV || 'development',
    SALT_WORK_FACTOR : 10,
    JWT_SECRET : 'revresjssorca',
    JWT_EXPIRE : 1440
};

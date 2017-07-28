/**
 * Created by E84266 on 2/24/2017.
 */

module.exports = {
    SERVER: {
        DOMAIN_HOST: '68.149.121.215',
        DOMAIN_PORT: '8080',
        HOST: 'localhost',
        PORT: 10007
    },
    DB: {
        HOST: 'localhost',
        PORT: 27017,
        DATABASE: 'acrossj',
        URL: 'mongodb://localhost:27017/acrossj'
    },
    LOG: {
        DIR: process.env.NODE_PATH + '/logs',
        FILE_LEVEL : 'info',
        CONSOLE_LEVEL : 'info',
        ACCESS_LOG_FORMAT : ':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time :res[content-length]',
    },
    JWT: {
        SALT_WORK_FACTOR : 10,
        SECRET: 'revresjssorca',
        PRIVATE_KEY: '37LvDSm4XvjYOh9Y',
        // TOKEN_EXPIRY: '24 hours',
        TOKEN_EXPIRY: 86400    // 24 hours in seconds
        // TOKEN_EXPIRY: 1 * 30 * 1000 * 60 //1 hour
    },
    EMAIL: {
        USER: 'acrossj1007@gmail.com',
        CLIENT_ID: '565222472091-lnanmfgtbbh6du9jij45epv98ip82ms3.apps.googleusercontent.com',
        CLIENT_SECRET: 'qeP-lDWxSPgAp-5nzTPyYga0',
        REFRESH_TOKEN: '1/nwFO3QGZYLpx22WxFjLggJDccJ8gI4KR8CbCYQ6WVEXkzmLJfvh4ipV1uP_1NFjC',
        CLIENT_BASE_URL: 'http://localhost:4200',
        VERIFY_EMAIL_URL: 'auth/verifyemail',
        RESET_PASSWORD_URL: 'auth/resetpassword',
        REDIRECT_URL: 'http://68.149.121.215/signin'
    },
    PM2_CONFIG_FILE : process.env.NODE_PATH + '/ecosystem.config.js',
    NODE_ENV : process.env.NODE_ENV || 'development',
};

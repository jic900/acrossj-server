module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [{
        name: "acrossj-server",
        script: "app.js",
        kill_timeout: 3000,
        wait_ready: true,
        instances: 2,
        exec_mode: "cluster",
        watch: true,
        ignore_watch: ["node_modules"],
        max_memory_restart: "256M",
//        log_file: "combined.outerr.log",
        out_file: "NULL",
        error_file: "NULL",
//        log_date_format: "",
//        merge_logs: true,
//        pid_file: "",
        env: {
            NODE_ENV: "development"
        },
        env_production: {
            NODE_ENV: "production"
        }
    }],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    /*
    deploy: {
        production: {
            user: "node",
            host: "212.83.163.1",
            ref: "origin/master",
            repo: "git@github.com:repo.git",
            path: "/var/www/production",
            "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env production"
        },
        dev: {
            user: "node",
            host: "212.83.163.1",
            ref: "origin/master",
            repo: "git@github.com:repo.git",
            path: "/var/www/development",
            "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env dev",
            env: {
                NODE_ENV: "dev"
            }
        }
    }
    */
}

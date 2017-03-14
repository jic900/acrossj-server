module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [{
        name: "acrossj-server",
//        cwd: process.env.ACROSSJ_HOME + "/acrossj-server",
        script: "app.js",
        kill_timeout: 3000,
        wait_ready: true,
        instances: 1,
        exec_mode: "cluster",
        watch: ["app.js", "config", "db", "models", "resources", "routes", "server", "utils"],
        ignore_watch: ["node_modules", "logs"],
        max_memory_restart: "256M",
//        log_file: "combined.outerr.log",
//        out_file: "output.log",
//        error_file: "error.log",
//        log_date_format: "",
        merge_logs: true,
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
    deploy: {
        /*
        production: {
            user: "node",
            host: "212.83.163.1",
            ref: "origin/master",
            repo: "git@github.com:repo.git",
            path: "/var/www/production",
            "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env production"
        },
        */
        development: {
            user: "qiz264",
            host: "192.168.86.157",
//            key: "$HOME/.ssh/id_rsa",
            ref: "origin/master",
            repo: "git@github.com:jic900/acrossj-server.git",
            path: "/var/www/acrossj/development",
            "post-setup": "ls -la",
            "post-deploy": "npm install && pm2 startOrGracefulReload ecosystem.config.js --env development",
            env: {
                NODE_ENV: "development"
            }
        }
    }
}

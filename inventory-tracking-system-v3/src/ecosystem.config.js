module.exports = {
    apps: [
      {
        name: "inventory-api",
        script: "./server.js", 
        instances: "max", 
        exec_mode: "cluster", 
        env: {
          NODE_ENV: "production",
          PORT: 8000
        },
        env_production: {
          REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
          RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
          DB_WRITE_URL: process.env.DB_WRITE_URL || "postgres://user:password@localhost:5432/db_name"
        },
        max_memory_restart: "1G", 
        combine_logs: true,
        error_file: "./logs/pm2-errors.log",
        out_file: "./logs/pm2-output.log"
      }
    ]
  };
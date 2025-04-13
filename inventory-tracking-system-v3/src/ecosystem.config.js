module.exports = {
    apps: [
      {
        name: "inventory-api",
        script: "./server.js", // Your main server file
        instances: "max", // Will create as many processes as CPU cores
        exec_mode: "cluster", // Essential for load balancing
        env: {
          NODE_ENV: "production",
          PORT: 8000
        },
        // Specific to your project needs:
        env_production: {
          REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
          RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
          DB_WRITE_URL: process.env.DB_WRITE_URL || "postgres://user:password@localhost:5432/db_name"
        },
        max_memory_restart: "1G", // Auto-restart if memory exceeds 1GB
        combine_logs: true,
        error_file: "./logs/pm2-errors.log",
        out_file: "./logs/pm2-output.log"
      }
    ]
  };
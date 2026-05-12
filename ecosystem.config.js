module.exports = {
  apps: [
    {
      name: 'preproom-server',
      script: './dist/src/index.js',
      cwd: '/root/preproom/server',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/root/preproom/logs/err.log',
      out_file: '/root/preproom/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 10000,
      listen_timeout: 8000,
    },
  ],
};

module.exports = {
  apps: [
    {
      name: 'personal-presentation',
      script: 'src/index.ts',
      interpreter: '/home/deployer/.bun/bin/bun',
      cwd: '/var/www/personal_presentation/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

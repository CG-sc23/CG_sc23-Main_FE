module.exports = {
  apps: [
    {
      name: 'DOMO',
      script: 'yarn',
      args: 'run start',
      autorestart: true,
      watch: false,
      instances: 0,
      exec_mode: 'cluster',
    },
  ],
};

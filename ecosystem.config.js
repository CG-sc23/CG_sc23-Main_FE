module.exports = {
  apps: [
    {
      name: 'DOMO',
      script: '/run/user/1000/fnm_multishells/9564_1701077243664/bin/yarn',
      args: 'run start',
      autorestart: true,
      watch: false,
      instances: 0,
      exec_mode: 'cluster',
    },
  ],
};

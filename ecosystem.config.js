module.exports = {  
  apps: [{
    name: 'wetiquette',
    script: 'server.js',       // ici
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
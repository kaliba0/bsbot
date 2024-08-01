module.exports = {
  apps: [
    {
      name: 'Rafaa',
      script: './main.js', // Remplacez par le chemin correct vers votre script principal
      env: {
        NODE_ENV: 'production',
        token: '',
        clientId: '1267055195586560051',
        guildId: '1266770571799167158',
        adminRoleId: '1267755192930271316',
        ticketscatId: '1268144029367799871',
        accountChannelId: '1267394382156267621',
        addAccountChannelId: '1268167002514657422',
        addFriendChannelId: '1268578316722372723',
        ticketChannelId: '1268162049385435241'
      },
      interpreter: '/home/aterzn/.nvm/versions/node/v18.20.4/bin/node', // Remplacez par le chemin correct vers Node.js v18
    }
  ]
};

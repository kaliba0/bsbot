const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    {
        name: 'tickets',
        description: 'Create a new ticket',
    },
    {
        name: 'ticket',
        description: 'Manage tickets',
        options: [
            {
                name: 'close',
                description: 'Close a ticket',
                type: 1, // Type 1 indicates a sub-command
            }
        ]
    },
    {
        name: 'account',
        description: 'Configure an account',
        options: [
            {
                name : 'image',
                description: 'Upload an image',
                type: 11, // Type 11 indicates an attachment
                required: false
            }
        ]
    },
    {
        name: 'clear',
        description: 'Clear all messages in the channel',
    },
    {
        name: 'add',
        description: 'Add some players to help you in the game',
    },
    {
        name: 'dev',
        description: 'Need a dev for anything ? Contact me !',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

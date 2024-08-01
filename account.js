const { Client, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { token, adminRoleId, accountChannelId, addAccountChannelId } = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('/account is available');
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'account') {
            // Vérifiez si l'utilisateur a le rôle admin
            if (!interaction.member.roles.cache.has(adminRoleId)) {
                await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
                return;
            }

            if (interaction.channelId !== addAccountChannelId) {
                await interaction.reply({ content: 'This command can only be used in the add-account channel.', ephemeral: true });
                return;
            }

            // Stockez l'image en pièce jointe si elle est fournie
            const image = interaction.options.getAttachment('image');

            try {
                const button = new ButtonBuilder()
                    .setCustomId('accountButton')
                    .setLabel('Configure Account')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(button);

                await interaction.reply({ content: 'Click the button to open the modal:', components: [row] });

                // Stockez l'image dans une variable globale (à usage unique) pour le modal
                client.imageAttachment = image;
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message avec le bouton:', error);
                await interaction.reply({ content: 'Une erreur s\'est produite lors de l\'envoi du message.', ephemeral: true });
            }
        }
    } else if (interaction.isButton() && interaction.customId === 'accountButton') {
        try {
            const modal = new ModalBuilder()
                .setCustomId('accountModal')
                .setTitle('Account Information');

            const price = new TextInputBuilder()
                .setCustomId('price')
                .setLabel('Price')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const trophies = new TextInputBuilder()
                .setCustomId('trophies')
                .setLabel('Trophies')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const rank35 = new TextInputBuilder()
                .setCustomId('rank35')
                .setLabel('Rank 35')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const rank30 = new TextInputBuilder()
                .setCustomId('rank30')
                .setLabel('Rank 30')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const description = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Description')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false); // Description n'est plus obligatoire

            modal.addComponents(
                new ActionRowBuilder().addComponents(price),
                new ActionRowBuilder().addComponents(trophies),
                new ActionRowBuilder().addComponents(rank35),
                new ActionRowBuilder().addComponents(rank30),
                new ActionRowBuilder().addComponents(description)
            );

            await interaction.showModal(modal);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du modal:', error);
            await interaction.reply({ content: 'Une erreur s\'est produite lors de l\'ouverture du modal.', ephemeral: true });
        }
    } else if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'accountModal') {
        try {
            const price = interaction.fields.getTextInputValue('price');
            const trophies = interaction.fields.getTextInputValue('trophies');
            const rank35 = interaction.fields.getTextInputValue('rank35');
            const rank30 = interaction.fields.getTextInputValue('rank30');
            const description = interaction.fields.getTextInputValue('description') || ''; // Description par défaut vide si non fournie

            const embed = new EmbedBuilder()
                .setTitle('‼️ A NEW ACCOUNT IS FOR SALE ‼️')
                .setColor('#FFBB00')
                .addFields(
                    { name: ':moneybag: Price', value: `${price}€`, inline: true },
                    { name: '<:bstrophy:1267429839573487782> Trophies', value: `${trophies} <:bstrophy:1267429839573487782>`, inline: true },
                    { name: '<:rank35:1267164453926080553> Ranks 35', value: `${rank35}`, inline: true },
                    { name: '<:rank30:1267166543490449518> Ranks 30', value: `${rank30}`, inline: true }
                );

            if (description) {
                embed.setDescription(description);
            }

            // Utilisez l'image stockée dans la variable globale
            if (client.imageAttachment) {
                embed.setImage(client.imageAttachment.url);
                // Supprimez l'image de la variable globale après l'utilisation
                client.imageAttachment = null;
            }

            const targetChannel = client.channels.cache.get(accountChannelId);
            if (!targetChannel) {
                console.error('Salon cible introuvable.');
                await interaction.reply({ content: 'Le salon cible est introuvable. Veuillez vérifier la configuration.', ephemeral: true });
                return;
            }

            await targetChannel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Votre récapitulatif a été envoyé dans le salon désigné.', ephemeral: true });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du récapitulatif:', error);
            await interaction.reply({ content: 'Une erreur s\'est produite lors de l\'envoi du récapitulatif. Veuillez réessayer.', ephemeral: true });
        }
    }
});

client.login(token);

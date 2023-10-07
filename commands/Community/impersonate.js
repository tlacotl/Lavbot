const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('impersonate')
    .setDescription('Impersonate a user with a webhook')
    .addUserOption(option => option.setName('user')
                                   .setDescription('The user you want to impersonate')
                                   .setRequired(true))
    .addStringOption(option => option.setName('message')
                                     .setDescription('The message you want the other person to say')
                                     .setRequired(true)),
    async execute (interaction) {
        const { options } = interaction;
        const member = options.getUser('user');
        const message = options.getString('message');

        await interaction.channel.createWebhook({
            name: member.username,
            avatar: member.displayAvatarURL({ dynamic: true })
        }).then((webhook) => {
            webhook.send({ content: message });
            setTimeout(() => {
                webhook.delete();
            }, 3000)
        });

        await interaction.reply({ content: `${member} has been impersonated below!`, ephemeral: true });
    }
}
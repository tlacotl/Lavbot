const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test Command'),
    async execute(interaction, client) {
        await interaction.reply({ content: 'I am alive :eye:'});
    }
}
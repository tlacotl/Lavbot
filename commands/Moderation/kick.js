const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('This kicks a server member.')
    .addUserOption(option => option.setName('target').setDescription('The user you would like to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for kicking the user').setRequired(true)),
    async execute (interaction, client) {

        const kickUser = interaction.options.getUser('target');
        const kickMember = await interaction.guild.members.fetch(kickUser.id);
        const channel = interaction.channel;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "You aren't allowed to do that", ephemeral: true});
        if (!kickMember) return await interaction.reply({ content: 'The user mentioned is no longer within the server', ephemeral: true});
        if (!kickMember.kickable) return await interaction.reply({ content: "I cannot kick them. They are too powerful...", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given.";

        const dmEmbed = new EmbedBuilder()
        .setColor('Blurple')
        .setDescription(`:white_check_mark: You have been kicked from **${interaction.guild.name} | ${reason}`)

        const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setDescription(`:white_check_mark: ${kickUser.tag} has been **kicked** | ${reason}`)

        await kickMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        });

        await kickMember.kick({ reason: reason }).catch(err => {
            interaction.reply({ content: "There was an error", ephemeral: true});
        });

        await interaction.reply({ embeds: [embed] });

    }
}
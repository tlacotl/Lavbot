const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user from the discord server")
    .setDefaultMemberPermissions(PermissionsBitField.BanMembers)
    .addStringOption(option =>
        option.setName("userid")
        .setDescription("Discord ID of the user you want to unban")
        .setRequired(true)
    ),

async execute(interaction) {
    const { channel, options } = interaction;

    const userId = options.getString("userid");

    try {
        await interaction.guild.members.unban(userId);

        const embed = new EmbedBuilder()
        .setDescription(`Successfully unbanned id ${userId} from the guild.`)
        .setColor("Blurple")
        .setTimestamp();

    await interaction.reply({
        embeds: [embed],
    });
    } catch (err) {
        console.log(err);

        const errEmbed= new EmbedBuilder()
        .setDescription(`Please provide a valid member's ID.`)
        .setColor("DarkRed");

        interaction.reply({ embeds: [errEmbed], ephemeral: true});
    }
}
}
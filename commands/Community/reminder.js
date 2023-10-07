const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const remindSchema = require('../../Schemas.js/remindSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder for yourself')
    .addSubcommand(command => command.setName('set').setDescription('Set a reminder').addStringOption(option => option.setName('reminder').setDescription('What do you want to be reminded of').setRequired(true)).addIntegerOption(option => option.setName('minutes').setDescription('How many minutes from now').setRequired(true).setMinValue(0).setMaxValue(59)).addIntegerOption(option => option.setName('hours').setDescription('How many hours from now').setRequired(false).setMinValue(0).setMaxValue(23)).addIntegerOption(option => option.setName('days').setDescription('How many days from now').setRequired(false).setMinValue(1).setMaxValue(31))),

    async execute (interaction) {

        const { options, guild } = interaction;
        const reminder = options.getString('reminder');
        const minute = options.getInteger('minutes') || 0;
        const hour = options.getInteger('hours') || 0;
        const day = options.getInteger('days') || 0;

        
	let time = Date.now() + (day * 24 * 60 * 60 * 1000) + (hour * 60 * 60 * 1000) + (minute * 60 * 1000);

        await remindSchema.create({
            User: interaction.user.id,
            Time: time,
            Remind: reminder
        });

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`📩 Your reminder has been set for <t:${Math.floor(time/1000)}:R>! I will remind you "${reminder}"`)

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

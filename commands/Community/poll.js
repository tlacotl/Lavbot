const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const pollschema = require('../../Schemas.js/votes');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Send a poll in your channel')
    .addStringOption(option => option.setName('topic')
                                     .setDescription('The topic for your poll')
                                     .setMinLength(1)
                                     .setMaxLength(2000)
                                     .setRequired(true)),
    async execute (interaction) {

        await interaction.reply({ content: `Your poll has been started below`, ephemeral: true });
        const topic = await interaction.options.getString('topic');

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: '✋ Poll System'})
        .setFooter({ text: '✋ Poll Started'})
        .setTimestamp()
        .setTitle(`📌 Poll Began`)
        .setDescription(`> ${topic}`)
        .addFields({ name: 'Upvotes', value: `> **No votes**`, inline: true})
        .addFields({ name: 'Downvotes', value: `> **No votes**`, inline: true})
        .addFields({ name: 'Author', value: `> ${interaction.user}`, inline: false})

        const buttons = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setCustomId('up')
            .setLabel('✅')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('down')
            .setLabel('❌')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('votes')
            .setLabel('Votes')
            .setStyle(ButtonStyle.Secondary),

        )

        const msg = await interaction.channel.send({ embeds: [embed], components: [buttons] });
        msg.createMessageComponentCollector();

        await pollschema.create({
            Msg: msg.id,
            Upvote: 0,
            Downvote: 0,
            UpMembers: [],
            DownMembers: [],
            Guild: interaction.guild.id,
            Owner: interaction.user.id
        })
    }
}
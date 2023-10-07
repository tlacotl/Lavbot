const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('8 ball game...but different')
    .addStringOption(option => option.setName('question')
    .setDescription(`This will be your question for the 8ball`)
    .setRequired(true)),
    async execute (interaction) {

        const { options } = interaction;

        const question = options.getString('question');
        const choice = ["🎱| It is certain.",
         "🎱| It is decidedly so.",
         "🎱| Without a doubt.",
         "🎱| Yes, definitely.",
         "🎱| You may rely on it.",
         "🎱| As I see it, yes.",
         "🎱| Most likely",
         "🎱| Outlook good.",
         "🎱| Yes.",
         "🎱| Reply hazy, try again.",
         "🎱| Signs point to yes.",
         "🎱| Ask again later.",
         "🎱| Better not tell you now.",
         "🎱| Cannot predict now",
         "🎱| Don't count on it.",
         "🎱| No.",
         "🎱| My sources say no.",
         "🎱| Outlook not so good.",
         "🎱| Very doubtful."]
        const ball = Math.floor(Math.random() * choice.length);

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`🎱| ${interaction.user.username}'s 8ball game`)
        .addFields({ name: "Question", value: `${question}`, inline: true})

        const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`🎱| ${interaction.user.username}'s 8ball game`)
        .addFields({ name: "Question", value: `${question}`, inline: true})
        .addFields({ name: "Answer", value: `${choice[ball]}`, inline: true})

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`button`)
            .setLabel(`Roll the ball!`)
            .setStyle(ButtonStyle.Primary)
        )

        const msg = await interaction.reply({ embeds: [embed], components: [button] });

        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async i => {
            if (i.customId == 'button') {
                i.update({ embeds: [embed2], components: [] })
            }
        })
    }
}
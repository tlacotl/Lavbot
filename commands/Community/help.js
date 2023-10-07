const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('This is the help command.'),
    async execute(interaction, client) {

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("lavbot Help Center")
        .setDescription(`Help Command Guide`)
        .addFields({ name: "Page 1", value: "Help & Resources"})
        .addFields({ name: "Page 2", value: "Community Commands"})
        .addFields({ name: "Page 3", value: "Moderation Commands"})

        const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setTitle("lavbot Community Commands")
        .addFields({ name: "/help", value: "Type /help for the commands list & support"})
        .addFields({ name: "/yt", value: "Type /yt and search for a youtube video"})
        .addFields({ name: "/img", value: "Type /img and search for an image on Google"})
        .addFields({ name: "/g", value: "Type /g and search for something on Google"})
        .addFields({ name: "/test", value: "Type /test to see if lavbot is alive"})
        .addFields({ name: "/wordle", value: "Type /wordle to play Wordle"})
        .addFields({ name: "/meme", value: "Type /meme to pull a random meme from r/memes"})
        .addFields({ name: "/dictionary", value: "Type /dictionary to find out what a word means"})
        .addFields({ name: "/chatgpt", value: "Type /chatgpt to ask lavbot a question and have them provide an answer"})
        .addFields({ name: "/cat", value: "Type /cat to get a random picture of a cat"})
        .addFields({ name: "/dog", value: "Type /dog to get a random picture of a dog"})
        .addFields({ name: "/8ball", value: "Type /8ball to roll lavbot's Magic 8 Ball"})
        .addFields({ name: "/spotify", value: "Type /spotify and enter a user to bring up what they're listining to if they have Spotify open and visible in their status"})
        .addFields({ name: "/wiki", value: "Type /wiki and enter something to search Wikipedia for"})
        .addFields({ name: "/remind", value: "Type /remind and set a reminder for yourself"})
        .addFields({ name: "/impersonate", value: "Type /impersonate and impersonate a user in the server"})
        .addFields({ name: "/poll", value: "Type /poll and enter in something people can upvote or downvote"})
        .addFields({ name: "/weather", value: "Type /weather and search for the weather for any given place"})
        .setFooter({ text: "lavbot Community Commands"})
        .setTimestamp()

        const embed3 = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("lavbot Moderation Commands")
        .addFields({ name: "/clear", value: "Type /clear and enter a number between 1-100 to delete that amount of messages from the channel it's typed in"})
        .addFields({ name: "/ban", value: "Type /ban, then enter a user to ban them, if you have the permissions to do so"})
        .addFields({ name: "/kick", value: "Type /kick, then enter a user to ban them from the server, if you have the permissions to do so"})
        .addFields({ name: "/unban", value: "Type /unban, then enter a user to unban them from the server, if you have the permissions to do so"})
        .addFields({ name: "/reactionrole", value: "Type /reactionrole input roles on buttons users can click to assign themselves specific roles"})
        .setFooter({ text: "lavbot Moderation Commands"})
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`page1`)
            .setLabel(`Page 1`)
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId(`page2`)
            .setLabel(`Page 2`)
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId(`page3`)
            .setLabel(`Page 3`)
            .setStyle(ButtonStyle.Success),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {

            if (i.customId === 'page1') {

                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons.`, ephemeral: true});
                }
                await i.update({ embeds: [embed], components: [button] })
            }

            if (i.customId === 'page2') {

                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons.`, ephemeral: true});
                }
                await i.update({ embeds: [embed2], components: [button] })
            }

            if (i.customId === 'page3') {

                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons.`, ephemeral: true});
                }
                await i.update({ embeds: [embed3], components: [button] })
            }

        })
    }
}
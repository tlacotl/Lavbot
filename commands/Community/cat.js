const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('cat command'),
    async execute (interaction) {

        async function cat() {
            await fetch(`https://www.reddit.com/r/catpictures/random/.json`)
            .then(async r => {

                let cat = await r.json();

                let title = cat[0].data.children[0].data.title;
                let image = cat[0].data.children[0].data.url;
                let author = cat[0].data.children[0].data.author;

                const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`${title}`)
                .setImage(`${image}`)
                .setURL(`${image}`)
                .setFooter({ text: author })

                await interaction.reply({ embeds: [embed] });
            })
        }

        cat();
    }
}
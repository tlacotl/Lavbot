const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('dog command'),
    async execute (interaction) {

        async function dog() {
            await fetch(`https://www.reddit.com/r/dogpictures/random/.json`)
            .then(async r => {

                let dog = await r.json();

                let title = dog[0].data.children[0].data.title;
                let image = dog[0].data.children[0].data.url;
                let author = dog[0].data.children[0].data.author;

                const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`${title}`)
                .setImage(`${image}`)
                .setURL(`${image}`)
                .setFooter({ text: author })

                await interaction.reply({ embeds: [embed] });
            })
        }

        dog();
    }
}
const wiki = require('wikijs').default();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`wiki`)
    .setDescription(`Search something from wikipedia`)
    .addStringOption(option => option.setName(`query`).setDescription(`Looks something up in wikipedia`).setRequired(true)),
    async execute (interaction) {

        const query = interaction.options.getString(`query`);

        await interaction.deferReply();

        const search = await wiki.search(query);
        if (!search.results.length) return await interaction.editReply({ content: `Wikipedia doesn't know what you're talking about.`, ephemeral: true});

        const result = await wiki.page(search.results[0]);

        const summary = await result.summary();
        if (summary.length > 8192) return await interaction.reply({ content: `${summary.slice(0, 2048)}`, ephemeral: true});
        else {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Wiki Search: ${result.raw.title}`)
            .setDescription(`\`\`\`${summary.slice(0, 2048)}\`\`\``)

            await interaction.editReply({ embeds: [embed] });
        }
    }
}
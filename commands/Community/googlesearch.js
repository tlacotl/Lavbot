const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('g')
        .setDescription('Search for a webpage on Google')
        .addStringOption(option => 
            option.setName('query')
                  .setDescription('The search query')
                  .setRequired(true)),
                  
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.CSE_ID,
                q: query,
                safe: 'medium'
            }
        });

        if (response.data.items && response.data.items.length > 0) {
            const firstResult = response.data.items[0];
            const embed = new EmbedBuilder()
                .setTitle(firstResult.title)
                .setURL(firstResult.link)
                .setDescription(firstResult.snippet)
                .setFooter({ text: `Result from Google Search` });

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('No results found.');
        }
    },
};

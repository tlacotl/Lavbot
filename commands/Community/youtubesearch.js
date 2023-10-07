const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yt')
        .setDescription('Search for a video on YouTube')
        .addStringOption(option => 
            option.setName('query')
                  .setDescription('The search query')
                  .setRequired(true)),
                  
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                key: process.env.GOOGLE_API_KEY,
                q: query,
                part: 'snippet',
                type: 'video',
                maxResults: 1
            }
        });

        if (response.data.items && response.data.items.length > 0) {
            const firstResult = response.data.items[0];
            const videoId = firstResult.id.videoId;
            const videoUrl = `https://youtu.be/${videoId}`;

            await interaction.reply(videoUrl);
        } else {
            await interaction.reply('No videos found.');
        }
    },
};

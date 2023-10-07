const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.gptkey
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription('Ask chatgpt a question!')
    .addStringOption(option => option.setName('question').setDescription(`This is going to be the question for chatgpt`).setRequired(true))
    .setDMPermission(false),
    async execute (interaction) {

        await interaction.deferReply();

        const question = interaction.options.getString('question');

        try {
            const res = await openai.createCompletion({
                model: 'text-davinci-003',
                max_tokens: 2048,
                temperature: 0.5,
                prompt: question
            })

            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`\`\`\`${res.data.choices[0].text}\`\`\``)

            await interaction.editReply({ embeds: [embed] });

        } catch(e) {
            console.log(e)
            return await interaction.editReply({ content: `Request failed with status code **${e.response.status}**`, ephemeral: true})
        }

    }
}
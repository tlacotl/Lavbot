const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Check the weather for a specific location')
        .setDMPermission(false)
        .addStringOption(option => option.setName('location').setDescription('The location you want to check the weather of').setRequired(true))
        .addStringOption(option => option.setName('degree-type').setDescription('Select what degree type you would like').addChoices({ name: `Farenheit`, value: 'F'}, { name: `Celsius`, value: 'C'}).setRequired(true)),

    async execute (interaction) {
        const { options } = interaction;
        const location = options.getString('location');
        const degree = options.getString('degree-type');

        await interaction.reply({ content: `🛰️ Acquiring Weather Data...`});

        await weather.find({ search: `${location}`, degreeType: `${degree}`}, async function(err,result) {
            setTimeout(() => {
                if (err) {
                    console.log(err);
                    interaction.editReply({ content: `${err} | I don't know what happened. Maybe a timeout? Try again.`});
                } else {
                    if (result.length == 0) {
                        return interaction.editReply( {content: `I couldn't find the weather for ${location}!`});
                    } else {
                        const temp = result[0].current.temperature;
                        const type = result[0].current.skytext;
                        const name = result[0].location.name;
                        const feel = result[0].current.feelslike;
                        const icon = result[0].current.imageUrl;
                        const wind = result[0].current.winddisplay;
                        const day = result[0].current.day;
                        const alert = result[0].location.alert || 'None';

                        const embed = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle(`Current weather of ${name}`)
                        .addFields({ name: 'Temperature', value: `${temp}`})
                        .addFields({ name: 'Feels Like', value: `${feel}`})
                        .addFields({ name: 'Weather', value: `${type}`})
                        .addFields({ name: 'Current Alerts', value: `${alert}`})
                        .addFields({ name: 'Week Day', value: `${day}`})
                        .addFields({ name: 'Wind Speed & Direction', value: `${wind}`})
                        .setThumbnail(icon);

                        interaction.editReply({ content: ``, embeds: [embed] });
                    }
                }
            }, 2000);
        });
    }
}

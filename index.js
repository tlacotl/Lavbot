const { Client, GatewayIntentBits, EmbedBuilder, ButtonStyle, PermissionsBitField, Permissions, MessageManager, Embed, Collection, User, Events, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences ] }); 

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
})();

client.once("ready", () => {
    //bot activity
    client.user.setActivity("Type /help to see commands!");
});

//reminder
const remindSchema = require('./Schemas.js/remindSchema');
setInterval(async () => {

    const reminders = await remindSchema.find();
    if (!reminders) return;
    else {

        reminders.forEach( async reminder => {

            if(reminder.Time > Date.now()) return;

            const user = await client.users.fetch(reminder.User);

            user?.send({
                content: `${user}, you asked me to remind you about: \`${reminder.Remind}\``
            }).catch(err => {return;});

            await remindSchema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind
            });
        });
    }
}, 1000 * 5);

//poll logic

const pollschema = require('./Schemas.js/votes');
client.on(Events.InteractionCreate, async i => {

    if (!i.guild) return;
    if (!i.message) return;
    if (!i.isButton) return;

    const data = await pollschema.findOne({ Guild: i.guild.id, Msg: i.message.id });
    if (!data) return;
    const msg = await i.channel.messages.fetch(data.Msg);

    if (i.customId === 'up') {
        if (data.UpMembers.includes(i.user.id)) return await i.reply({ content: `You cannot vote again. You have already sent an upvote on this poll`, ephemeral: true });

        let downvotes = data.Downvote;
        if (data.DownMembers.includes(i.user.id)) {
            downvotes = downvotes - 1;
        }

        const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `Upvotes`, value: `> **${data.Upvote + 1}** Votes`, inline: true }, { name: 'Downvotes', value: `> **${downvotes}** Votes`, inline: true}, { name: `Author`, value: `> <@${data.Owner}>`})

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

        await i.update({ embeds: [newembed], components: [buttons] });

        data.Upvote++;

        if (data.DownMembers.includes(i.user.id)) {
            data.Downvote = data.Downvote - 1;
        }

        data.UpMembers.push(i.user.id);
        data.DownMembers.pull(i.user.id);
        data.save();

    }

    if (i.customId === 'down') {

        if (data.DownMembers.includes(i.user.id)) return await i.reply({ content: `You cannot down vote twice on this poll!`, ephemeral: true });

        let upvotes = data.Upvote;
        if (data.UpMembers.includes(i.user.id)) {
            upvotes = upvotes - 1;
        }

        const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `Upvotes`, value: `> **${upvotes}** Votes`, inline: true }, { name: 'Downvotes', value: `> **${data.Downvote + 1}** Votes`, inline: true}, { name: 'Author', value: `> <@${data.Owner}>`}) 

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

        await i.update({ embeds: [newembed], components: [buttons] });

        data.Downvote++;

        if (data.UpMembers.includes(i.user.id)) {
            data.Upvote = data.Upvote - 1        }

            data.DownMembers.push(i.user.id);
            data.UpMembers.pull(i.user.id);
            data.save();
        }
    
        if (i.customId === 'votes') {
    
            let upvoters = [];
            await data.UpMembers.forEach(async member => {
                upvoters.push(`<@${member}>`)
            });
    
            let downvoters = [];
            await data.DownMembers.forEach(async member => {
                downvoters.push(`<@${member}>`)
            });
    
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: '✋ Poll System'})
            .setFooter({ text: '✋ Poll Members'})
            .setTimestamp()
            .setTitle(`Poll Votes`)
            .addFields({ name: `Upvoters (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || `No upvoters!`}`, inline: true})
            .addFields({ name: `Downvoters (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || `No downvoters!`}`, inline: true})
    
            await i.reply({ embeds: [embed], ephemeral: true});
        }
    });
    



//Message Content Triggers and Responses

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "hey lavbot") {
        await message.reply(`Hi there, ${message.author}`);
    } else if (message.content.toLowerCase() === "bye lavbot") {
        await message.reply(`Bye, ${message.author}`);
        //say 'hey lavbot' and have lavbot reply, tagging the user who said hey
    }
    if (message.content.toLowerCase() === "ty lavbot") {
        await message.reply(`You're welcome, ${message.author}`);
        // thank lavbot and have it say You're welcome
    } 
});


client.login(process.env.token); //logs in
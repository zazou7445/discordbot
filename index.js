const fs = require('fs');
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const config = require("./config.json");

let statuses = [`${config.status1}`, `${config.status2}`, `${config.status3}`, `${config.status4}`];

client.on("ready", () => {
  setInterval(function() {
    let status = statuses[Math.floor(Math.random()*statuses.length)];
    client.user.setPresence({ game: { name: status , type: `${config.statustype}`}, status: 'online '});
  }, 10000)
});

client.on("ready", () => {
  console.log(`Bot is back`)
});

//Logs

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.channels.get(config.logschannel).send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.channels.get(config.logschannel).send(`I have been removed from: ${guild.name} (id: ${guild.id})`)
});

client.on("channelCreate", channel => {
  client.channels.get(config.logschannel).send(`New channel created in ${channel.guild.name}: ${channel.name} (id: ${channel.id}).`)
})

client.on("channelDelete", channel => {
  client.channels.get(config.logschannel).send(`Channel deleted in ${channel.guild.name}: ${channel.name} (id: ${channel.id}).`)
})

client.on("channelUpdate", channel => {
  client.channels.get(config.logschannel).send(`Channel edited in ${channel.guild.name}: ${channel.name} (id: ${channel.id}).`)
})

client.on("channelPinsUpdate", channel => {
  client.channels.get(config.logschannel).send(`Channel pins edited in ${channel.guild.name}: ${channel.name} (id: ${channel.id}).`)
})

client.on("emojiCreate", emoji => {
  client.channels.get(config.logschannel).send(`New emoji created in ${emoji.guild.name}: ${emoji.name}`)
})

client.on("emojiDelete", emoji => {
  client.channels.get(config.logschannel).send(`Emoji deleted in ${emoji.guild.name}: ${emoji.name}`)
})

client.on("emojiUpdate", emoji => {
  client.channels.get(config.logschannel).send(`Emoji edited in ${emoji.guild.name}: ${emoji.name}`)
})

client.on("guildMemberAdd", member => {
  client.channels.get(config.logschannel).send(`New member joined ${member.guild.name}: ${member}`)
})

client.on("guildMemberRemove", member => {
  client.channels.get(config.logschannel).send(`Member left ${member.guild.name}: ${member}`)
})

client.on("guildUnavailable", guild => {
  client.channels.get(config.logschannel).send(`${guild.name} has become unavailable. Possibly due to an outage.`)
})

//Welcome

client.on('guildMemberAdd', member => {
  var channel= member.guild.channels.find("name", "CHANNEL_NAME");
    let embed = new Discord.RichEmbed()
      .setAuthor(`${member.guild.name}`)
      .setColor(`RANDOM`)
      .addField('Welcome', `Hi ${member} welcome to ${member.guild.name}`)
		  .setFooter(`We now have ${member.guild.memberCount} users`)
		  .setTimestamp();
      channel.send({ embed: embed });
      return;  
});

//Commands

client.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "ping") {
    const m = await message.channel.send("Am I slow?\nLoading...\n");
    m.edit(`Am I slow?\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms\n`);
  }
  if(command === "user-info") {
    message.delete().catch(O_o=>{});
    let member = message.mentions.members.first() || message.member,
    user = member.user;
    let embed = new Discord.RichEmbed()
      .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
      .setColor(`RANDOM`)
      .setThumbnail(`${user.displayAvatarURL}`)
      .addField("ID:", `${user.id}`, true)
      .addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
      .addField('Status:', user.presence.status, true)
      .addField("In Server", message.guild.name, true)
      .addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
      .addField("Created:", user.createdAt, true)
      .addField("Joined:", member.joinedAt, true)
      .addField("Bot:", `${user.bot}`, true)
      .addField('Roles:', member.roles.map(r => `${r}`).join(' | '), true)
      .setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)
      .setTimestamp();
      message.channel.send({ embed: embed });
      return;
  }
  if(command === "server-info") {
    message.delete().catch(O_o=>{});
		let embed = new Discord.RichEmbed()
		  .setAuthor(message.guild.name)
		  .setColor(`RANDOM`)
		  .setThumbnail(`${message.guild.iconURL}`)
		  .addField("ID:", `${message.guild.id}`, true)
      .addField('Total Members:', message.guild.memberCount, true)
      .addField('Server Region:', message.guild.region, true)
      .addField('Created:', message.guild.createdAt, true)
		  .setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)
		  .setTimestamp();
		  message.channel.send({ embed: embed });
		  return;
    }
    if(command === "report") {
      message.delete().catch(O_o=>{}); 
		  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		  if(!member)
		  return message.reply("Please mention a valid member of this server");
		  let report = args.slice(1).join(' ');
		  if(!report) report = "No reason provided";
		  message.channel.send(`Thank you for your report, we will process it and do any required actions`)
		  client.channels.get(config.reportchannel).send(`${member} has been reported by ${message.author.tag} in ${message.channel.name} for ${report}`)
    }
  if(command === "warn") {
    if(!message.member.hasPermission(`BAN_MEMBERS`))
        return message.reply("Sorry, you don't have permissions to use this!");
        message.delete().catch(O_o=>{}); 
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
        return message.reply("Please mention a valid member of this server");
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
        message.channel.send(`${member} has been warned by ${message.author.tag} for ${reason}`)
        client.channels.get(config.warningchannel).send(`${member} has been warned by ${message.author.tag} in ${message.guild.name} for ${reason}`)
        client.channels.get(config.logschannel).send(`${member} has been warned by ${message.author.tag} in ${message.guild.name} for ${reason}`)
  }
  if(command === "kick") {
    if(!message.member.hasPermission(`KICK_MEMBERS`))

      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);

    if(!member)

      return message.reply("Please mention a valid member of this server");

    if(!member.kickable) 

      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    let reason = args.slice(1).join(' ');

    if(!reason) reason = "No reason provided";

    member.kick(reason)

      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));

    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    client.channels.get(config.logschannel).send(`${member} has been kicked by ${message.author.tag} in ${message.guild.name} for ${reason}`)
  }
  if(command === "ban") {
    if(!message.member.hasPermission(`BAN_MEMBERS`))

    return message.reply("Sorry, you don't have permissions to use this!");

  let member = message.mentions.members.first();

  if(!member)

    return message.reply("Please mention a valid member of this server");

  if(!member.bannable) 

    return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

  let reason = args.slice(1).join(' ');

  if(!reason) reason = "No reason provided";

member.ban(reason)

    .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));

  message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  client.channels.get(config.logschannel).send(`${member} has been banned by ${message.author.tag} in ${message.guild.name} for ${reason}`)
  }
  if(command === "purge") {
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    client.channels.get(config.logschannel).send(`${message.author.tag} has cleared ${deleteCount} messages from ${message.channel.name} in ${message.guild.name}`)
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
}});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
	  command.execute(message, args);
    } catch (error) {
    	console.error(error);
	   message.reply('there was an error trying to execute that command!');
    }
});

client.login(process.env.TOKEN);

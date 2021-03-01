const Discord = require("discord.js")
const client = new Discord.Client()
const keep_alive = require('./keep_alive.js')
const { prefix } = require("./config.json");
const config = require("./config.json")
const Enmap = require("enmap")
const canvacord = require("canvacord")

client.points = new Enmap({ name: "points" });

const leveling = require("./ranking.js");

leveling(client);

client.login(process.env.TOKEN)

client.on('ready', function() {
    client.user.setActivity(`encode.gq | !help`, { type: 'LISTENING' });
    client.emit('debug', `client ready and listening to; ${client.guilds.cache.size} guilds and ${client.channels.cache.filter(c => c.type === 'text').size} channels.`);
});

const ytdl = require("ytdl-core");

const queue = new Map();

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    if (command === "help") {
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle(`My commands`)
            .setDescription(`**Prefix:** ${config.prefix}`)
            .addField(`\`kick\``, `Usage: **${config.prefix}kick [@User]**\n**${config.prefix}kick [@User][Reason]**`)
            .addField(`\`ban\``, `Usage: **${config.prefix}ban [@User]**\n**${config.prefix}ban [@User][Reason]**`)
            .addField(`\`mute\``, `Usage: **${config.prefix}mute [@user]**\n**${config.prefix}mute [@user] [reason]**`)
            .addField(`\`unmute\``, `Usage: **${config.prefix}unmute [@user]**\n**${config.prefix}unmute [@user] [reason]**`)
            .addField(`\`add\``, `Adds a role to a user \nUsage: **${config.prefix}add [@User] [Role]**`)
            .addField(`\`remove\``, `Removes a role from a user \nUsage: **${config.prefix}remove [@User] [Role]**`)
            .addField(`\`say\``, `Have the bot say something`)
            .addField(`\`play\``, `Join a Voice Channel And Listen to Music`)
            .addField(`\`skip\``, `Skips the currently playing song`)
            .addField(`\`stop\``, `Stops the currently playing song`)
        message.channel.send(helpEmbed)
    }

    //!links

    if (command === "links") {
       const helpEmbed = new Discord.MessageEmbed()
          .setTitle(`${client.user.username}'s command`)
          .setDescription(`**My Links!**`)
          .addField(`\`YouTube\``, `https://www.youtube.com/channel/UCfQyz30ggW7vBRoANwOLVug`)
          .addField(`\`Coder\``\``, `VandineGamer#1722`)
        message.channel.send(helpEmbed)
    }

   //!mod

    if (command === "mod") {
       const helpEmbed = new Discord.MessageEmbed()
          .setTitle(`${client.user.username}'s command`)
          .setDescription(`**My Links!**`)
          .addField(`\`kick\``, `Usage: **${config.prefix}kick [@User]**\n**${config.prefix}kick [@User][Reason]**`)
          .addField(`\`ban\``,`Usage: **${config.prefix}ban [@User]**\n**${config.prefix}ban [@User][Reason]**`)
          .addField(`\`mute\``, `Usage: **${config.prefix}mute [@User]**\n**${config.prefix}mute [@User] [reason]**`)
          .addField(`\`unmute\``, `Usage: **${config.prefix}unmute [@User]**\n**${config.prefix}unmute [@User] [reason]**`)
        message.channel.send(helpEmbed)
    }

    //!kick

    if (command === "kick") {
        if (!message.member.hasPermission('KICK_MEMBERS'))
            return message.channel.send("Insufficient permissions (Requires permission `Kick members`)").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send("Please Menstion An User You Want Kick").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        if (!member.kickable)
            return message.channel.send("This user is unkickable").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const reason = args.slice(1).join(" ")
        if (member) {
            if (!reason) return member.kick().then(member => {
                message.channel.send(`${member.user.tag} was kicked, no reason was provided`);
            })

            if (reason) return member.kick().then(member => {
                message.channel.send(`${member.user.tag} was kicked for ${reason}`);
            })
        }
    }

   //!ban

    if (command === "ban") {
        if (!message.member.hasPermission('BAN_MEMBERS'))
            return message.channel.send("Insufficient permissions (Requires permission `Ban members`)").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send("Please Menstion A User You Want Ban").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        if (!member.bannable)
            return message.channel.send("This user is unbannable").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const reason = args.slice(1).join(" ")
        if (member) {
            if (!reason) return member.ban().then(member => {
                message.channel.send(`${member.user.tag} was banned, no reason was provided`);
            })

            if (reason) return member.ban(reason).then(member => {
                message.channel.send(`${member.user.tag} was banned for ${reason}`);
            })
        }
    }

     //!add

    if (command === "add") {
        if (!message.member.hasPermission('MANAGE_ROLES'))
            return message.channel.send("Insufficient permissions (Requires permission `Manage roles`)").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const member = message.mentions.members.first()
        if (!member)
            return message.channel.send("You have not mentioned a user").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const add = args.slice(1).join(" ")
        if (!add)
            return message.channel.send("You have not specified a role").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const roleAdd = message.guild.roles.cache.find(role => role.name === add)
        if (!roleAdd)
            return message.channel.send("This role does not exist").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        if (member.roles.cache.get(roleAdd.id))
            return message.channel.send(`This user already has the ${add} role`).then(msg => {
        msg.delete({ timeout: 30000 })
    })
        member.roles.add(roleAdd.id).then((member) => {
            message.channel.send(`${add} added to ${member.displayName}`)
        })
    }

    //!remove

    if (command === "remove") {
        if (!message.member.hasPermission('MANAGE_ROLES'))
            return message.channel.send("Insufficient permissions (Requires permission `Manage roles`)").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const member = message.mentions.members.first()
        if (!member)
            return message.channel.send("You have not mentioned a user").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const remove = args.slice(1).join(" ")
        if (!remove)
            return message.channel.send("You have not specified a role").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        const roleRemove = message.guild.roles.cache.find(role => role.name === remove)
        if (!roleRemove)
            return message.channel.send("This role does not exist").then(msg => {
        msg.delete({ timeout: 30000 })
    })
        if (!member.roles.cache.get(roleRemove.id))
            return message.channel.send(`This user does not have the ${remove} role`).then(msg => {
        msg.delete({ timeout: 30000 })
    })
        member.roles.remove(roleRemove.id).then((member) => {
            message.channel.send(`${remove} removed from ${member.displayName}`)
        })
    }

    //!say

    if (command === "say") {
    const text = args.join(" ")
    if(!text) return message.channel.send("You have not specified something to say")
    message.channel.send(text)
    
    }

});

//welcome-goodbye

client.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome')
    welcomeChannel.send (`Welcome! ${member}`)
})

client.on("guildMemberRemove", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'goodbye')
    welcomeChannel.send (`Goodbye! ${member}`)
})

//automod

client.on('message', message => {
if (config.automod == true) {

  if (config.automodpunishment == "kick") {
    for (var i = 0; i < config.badwords.length; i++) {
      if (message.content.includes(config.badwords[i])) {

      let member = message.member;

      message
        .delete({timeout: 1})
        .catch(err => {
          message.channel.send("")
          console.error(err)
        });

      member
        .kick('Automod')
        .then(() => {
          message.channel.send(`EnCode kicked ${message.author}, Please Read the Rules thank you`)
        })
        .catch(err => {
          message.channel.send("Please Don't Swear.")
          console.error(err);
        });
        break;
      }
    }
  }
  else if (config.automodpunishment == "delete") {
    for (var i = 0; i < config.badwords.length; i++) {
      if (message.content.includes(config.badwords[i])) {
        message
        .delete({timeout: 1})
        .catch(err => {
          message.channel.send("Please Don't Swear.")
          console.error(err);
        });
      }
    }

  };

};

});

//Music

settings = {
    prefix: config.prefix,
    token: process.env.TOKEN
};

const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;
client.player.on('trackStart', (message, track) => message.channel.send(`Now playing ${track.title}...`))

client.on("message", async (message) => {

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // !play Despacito
    // will play "Despacito" in the member voice channel

    if(command === "play"){
        client.player.play(message, args[0]);
        // as we registered the event above, no need to send a success message here
    }

});
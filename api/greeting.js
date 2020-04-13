export function greeting() {
'use strict';
var auth = require('../auth.json');

// Import the discord.js module
const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Fungsi Baca JSON
const fs = require('fs');
function configJSON(filename,guildID){
    let dir = '../config/'+guildID+'/'+filename+'.json';
    let config = JSON.parse(fs.readFileSync(dir));
    return config;
}

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  var systemChName = member.guild.systemChannel.name
  var guildName = member.guild.name
  var guildID = member.guild.id;
  var config = configJSON('server',guildID);
  var greetingMsg = config.greeting[0];
  greetingMsg = greetingMsg.replace('!servername',guildName);
  greetingMsg = greetingMsg.replace('!member',member);
  const channel = member.guild.channels.cache.find(ch => ch.name === systemChName);
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(greetingMsg);
});
client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
  var systemChName = member.guild.systemChannel.name
  var guildName = member.guild.name
  var guildID = member.guild.id;
  var config = configJSON('server',guildID);
  var greetingMsg = config.greeting[1];
  greetingMsg = greetingMsg.replace('!servername',guildName);
  greetingMsg = greetingMsg.replace('!member',member);
  const channel = member.guild.channels.cache.find(ch => ch.name === systemChName);
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
  channel.send(greetingMsg);
});

client.login(auth.token);
}
'use strict';
var auth = require('./auth.json');

// Import the discord.js module
const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();

// Set Presence Discord Bot
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('online')
    client.user.setPresence({
        activity: {
            name: 'Support @nekonyan.id',
            type: "PLAYING"
        },
        status:"online"
    });
});

client.login(auth.token);
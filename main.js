const Discord = require('discord.js');
const client = new Discord.Client();
const router = require('./routes/router');
require('dotenv').config()
const token = process.env.token || "-";
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    router(msg)
});

client.login(token);
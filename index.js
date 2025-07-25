const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ]
});

let flaggedUsers = JSON.parse(fs.readFileSync('./flaggedUsers.json', 'utf8'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async member => {
  const userId = member.id;
  if (flaggedUsers.discord[userId]) {
    const reason = flaggedUsers.discord[userId];
    try {
      await member.ban({ reason: `Auto-ban: ${reason}` });
      console.log(`Banned user ${member.user.tag} (${userId}) for reason: ${reason}`);
    } catch (err) {
      console.error(`Failed to ban ${member.user.tag}:`, err);
    }
  }
});

client.login(process.env.BOT_TOKEN);

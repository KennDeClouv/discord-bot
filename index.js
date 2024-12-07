const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const readline = require("readline");
const home = require("./home");
const addroles = require("./addroles");
const welcomerin = require("./welcomerin");
const welcomerout = require("./welcomerout");
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
});

client.once("ready", () => {
  console.log(`Bot ${client.user.tag} is ready!`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const commands = {
  home: {
    channelId: "1314493855277649930",
    embeds: [home.embed1, home.embed2],
    components: [home.row],
    interactionHandler: home.handleInteraction,
  },
  addroles: {
    channelId: "1314480699126054973",
    embeds: [addroles.embed],
    components: [addroles.row],
    interactionHandler: addroles.handleInteraction,
  },
};

rl.on("line", (input) => {
  const command = commands[input.trim().toLowerCase()];
  if (command) {
    const channel = client.channels.cache.get(command.channelId);
    if (channel) {
      channel.send({
        embeds: command.embeds,
        components: command.components,
      });
      console.log(`Message sent to channel ${command.channelId}`);
    } else {
      console.error(`Channel with id ${command.channelId} not found.`);
    }
  }
});

Object.values(commands).forEach((cmd) => {
  client.on("interactionCreate", cmd.interactionHandler);
});

client.on("guildMemberAdd", (member) => {
  const welcomeMessage = welcomerin.generateWelcomeMessageIn(member.user.avatarURL(), member.user.username);
  member.guild.channels.cache.get("1314236534484111372").send(welcomeMessage);
  const roleId = "1314374871324561599";
  const role = member.guild.roles.cache.get(roleId);
  if (role) {
    member.roles
      .add(role)
      .then(() => console.log(`Role "${role.name}" added to member ${member.user.tag}`))
      .catch(console.error);
  } else {
    console.error(`Role with ID "${roleId}" not found.`);
  }
});

client.on("guildMemberRemove", (member) => {
  const farewellMessage = welcomerout.generateWelcomeMessageOut(member.user.avatarURL(), member.user.username);
  member.guild.channels.cache.get("1314494044486766663").send(farewellMessage);
});

client.login(process.env.TOKEN);

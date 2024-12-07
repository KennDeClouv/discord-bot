const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const readline = require("readline");
const home = require("./home");
const addroles = require("./addroles");
const welcomerin = require("./welcomerin");
const welcomerout = require("./welcomerout");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

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

// level system

// File tempat menyimpan data leveling
const levelDataFile = "./levelData.json";
let levelData = {};

// Load data leveling saat bot mulai
if (fs.existsSync(levelDataFile)) {
  levelData = JSON.parse(fs.readFileSync(levelDataFile, "utf-8"));
}

// Simpan data leveling ke file
const saveLevelData = () => {
  fs.writeFileSync(levelDataFile, JSON.stringify(levelData, null, 2), "utf-8");
};

// Konfigurasi xp dan leveling
const xpPerMessage = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
const cooldown = 1 * 1000; // 1 menit dalam milidetik
const levelUpXp = (level) => level * level * 100; // Rumus xp naik level
const levelRewards = {
  1: "1314374871324561599",
  5: "1314375062765174814",
  10: "1314375157652914177",
  15: "1314387090301259798",
  20: "1314375259218251856",
};

client.on("messageCreate", (message) => {
  if (message.author.bot) return; // Abaikan pesan bot

  const { author, guild } = message;
  const userId = author.id;

  // Inisialisasi data user
  if (!levelData[userId]) {
    levelData[userId] = {
      xp: 0,
      level: 1,
      lastMessage: 0,
    };
  }

  const userData = levelData[userId];
  const now = Date.now();

  // Cek cooldown
  if (now - userData.lastMessage < cooldown) return;

  // Tambahkan xp
  userData.xp += xpPerMessage;
  userData.lastMessage = now;

  // Cek level up
  const requiredXp = levelUpXp(userData.level);
  if (userData.xp >= requiredXp) {
    userData.level += 1;
    userData.xp -= requiredXp;

    const targetChannel = guild.channels.cache.get("1314371530204905584"); // ganti dengan channel id yang dituju

    if (targetChannel) {
      const levelUpEmbed = new EmbedBuilder()
        .setColor(0xf7f7f7)
        .setTitle(`> Level Up! ${message.author.username}`)
        .setDescription(`Selamat ${message.author}, kamu naik ke level **${userData.level}**! 🎉`)
        .setImage("https://i.ibb.co.com/Y0C1Zcw/tenor.gif")
        .setFooter({ text: "Terus aktif untuk naik level lebih tinggi!" });

      targetChannel.send({ embeds: [levelUpEmbed] });
    } else {
      console.error("Channel not found");
    }

    // Cek hadiah role
    const rewardRoleId = levelRewards[userData.level];
    if (rewardRoleId) {
      const role = guild.roles.cache.get(rewardRoleId);
      if (role) {
        const member = guild.members.cache.get(userId);
        if (member) {
          member.roles
            .add(role)
            .then(() => {
              const roleEmbed = new EmbedBuilder()
                .setColor(0xf7f7f7)
                .setTitle(`> Role Awarded! ${message.author.username}`)
                .setDescription(`${message.author}, kamu mendapatkan role **${role.name}**! 🎉`)
                .setImage("https://i.ibb.co.com/Y0C1Zcw/tenor.gif")
                .setFooter({ text: "Terus aktif untuk mendapatkan lebih banyak role!" });

              targetChannel?.send({ embeds: [roleEmbed] });
            })
            .catch(console.error);
        }
      }
    }
  }

  // Simpan data
  saveLevelData();
});


client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const member = interaction.options.getUser("member") || interaction.user;
  const level = interaction.options.getInteger("level");
  const xp = interaction.options.getInteger("xp");

  if (interaction.commandName === "level") {
    const userId = interaction.user.id;

    // cek data user di levelData
    const userData = levelData[userId];
    if (!userData) {
      const embed = new EmbedBuilder().setColor(0xff0000).setTitle(`> Level info ${interaction.user.username}`).setDescription("kamu belum memiliki data leveling. kirim pesan untuk mulai mengumpulkan xp!").setImage("https://i.ibb.co.com/Y0C1Zcw/tenor.gif").setFooter({ text: "Mulai kirim pesan untuk mengumpulkan xp!" });

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    try {
      // buat embed
      const embed = new EmbedBuilder()
        .setColor(0xf7f7f7)
        .setTitle(`> Level info ${interaction.user.username}`)
        .setDescription(`**level saat ini:** ${userData.level}\n**xp saat ini:** ${userData.xp}/${levelUpXp(userData.level)}`)
        .setImage("https://i.ibb.co.com/Y0C1Zcw/tenor.gif")
        .setFooter({ text: "terus aktif untuk naikan level kamuu!" });

      // kirim embed
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.error("error generating level info:", error);
      await interaction.reply({
        content: "terjadi kesalahan saat menampilkan info level.",
        ephemeral: true,
      });
    }
  }

  if (interaction.commandName === "level-set") {
    // Setel level member tertentu
    if (!level) return interaction.reply({ content: "Level harus diisi.", ephemeral: true });

    levelData[member.id] = levelData[member.id] || { level: 0, xp: 0 };
    levelData[member.id].level = level;

    await interaction.reply({
      content: `Level ${member.username} telah diatur menjadi level ${level}.`,
      ephemeral: true,
    });
    saveLevelData();
  }

  if (interaction.commandName === "level-add") {
    // Tambah level member
    if (!level) return interaction.reply({ content: "Level yang ditambahkan harus diisi.", ephemeral: true });

    levelData[member.id] = levelData[member.id] || { level: 0, xp: 0 };
    levelData[member.id].level += level;

    await interaction.reply({
      content: `Level ${member.username} telah ditambahkan ${level}. Level sekarang: ${levelData[member.id].level}.`,
      ephemeral: true,
    });
    saveLevelData();
  }

  if (interaction.commandName === "xp-set") {
    // Setel XP member tertentu
    if (!xp) return interaction.reply({ content: "XP harus diisi.", ephemeral: true });

    levelData[member.id] = levelData[member.id] || { level: 0, xp: 0 };
    levelData[member.id].xp = xp;

    await interaction.reply({
      content: `XP ${member.username} telah diatur menjadi ${xp}.`,
      ephemeral: true,
    });
    saveLevelData();
  }

  if (interaction.commandName === "xp-add") {
    // Tambah XP member
    if (!xp) return interaction.reply({ content: "XP yang ditambahkan harus diisi.", ephemeral: true });

    levelData[member.id] = levelData[member.id] || { level: 0, xp: 0 };
    levelData[member.id].xp += xp;

    await interaction.reply({
      content: `XP ${member.username} telah ditambahkan ${xp}. XP sekarang: ${levelData[member.id].xp}.`,
      ephemeral: true,
    });
    saveLevelData();
  }
});

client.login(process.env.TOKEN);

const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const readline = require("readline");
const home = require("./home");
const addroles = require("./addroles");
const welcomerin = require("./welcomerin");
const welcomerout = require("./welcomerout");
const { EmbedBuilder } = require("discord.js");
const roleInfo = require("./role-info");
const mysql = require("mysql2");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions],
});

client.once("ready", () => {
  console.log(`Bot ${client.user.tag} is ready!`);
  // Set status bot
  client.user.setPresence({ activities: [{ name: process.env.SET_ACTIVITY }], status: process.env.SET_STATUS });
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
        components: command.components ? command.components : [],
      });
      console.log(`Message sent to channel ${command.channelId}`);
    } else {
      console.error(`Channel with id ${command.channelId} not found.`);
    }
  }
});

rl.on("line", (input) => {
  if (input.trim() === "rolesinfo") {
    const channel = client.channels.cache.get("1314963411175477249");
    channel.send({ embeds: [roleInfo.roleInfoEmbed] });
    console.log("sent");
  }
});

Object.values(commands).forEach((cmd) => {
  client.on("interactionCreate", cmd.interactionHandler ? cmd.interactionHandler : null);
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
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Host dari URI
  port: process.env.DB_PORT, // Port dari URI
  user: process.env.DB_USER, // User dari URI
  password: process.env.DB_PASSWORD, // Password dari URI
  database: process.env.DB_NAME, // Nama database
});

// Pastikan koneksi berhasil
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL!");
  }
});

const getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM levels WHERE user_id = ?", [userId], (err, results) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return reject(err);
      }
      resolve(results[0]); // Kembalikan data user (jika ada)
    });
  });
};

const saveUserData = (userId, xp, level, lastMessage) => {
  db.query("INSERT INTO levels (user_id, xp, level, last_message) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE xp = ?, level = ?, last_message = ?", [userId, xp, level, lastMessage, xp, level, lastMessage], (err) => {
    if (err) console.error("Error saving user data:", err);
  });
};

// Konfigurasi xp dan leveling
const xpPerMessage = Math.floor(Math.random() * (30 - 20 + 1)) + 20 * process.env.XP_MULTIPLIER;
const cooldown = process.env.COOLDOWN * 60 * 1000;
const userCooldowns = new Map();
const levelUpXp = (level) => level * level * 100;
const levelRewards = require("./config.json");

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const { author, guild } = message;
  const userId = author.id;

  try {
    let userData = await getUserData(userId);

    if (!userData) {
      saveUserData(userId, 0, 1, 0);
      userData = { xp: 0, level: 1, lastMessage: 0 };
    }

    const now = Date.now();
    const lastMessageTime = userCooldowns.get(userId) || 0;

    if (now - lastMessageTime < cooldown) return;

    userData.xp += xpPerMessage;
    userCooldowns.set(userId, now);

    const requiredXp = levelUpXp(userData.level);
    if (userData.xp >= requiredXp) {
      userData.level += 1;
      userData.xp -= requiredXp;

      const targetChannel = guild.channels.cache.get("1314371530204905584");

      if (targetChannel) {
        const levelUpEmbed = new EmbedBuilder().setColor(0xf7f7f7).setTitle(`> Level Up! ${message.author.username}`).setDescription(`Selamat ${message.author}, kamu naik ke level **${userData.level}**! 🎉`).setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif").setFooter({ text: "Terus aktif untuk naik level lebih tinggi!" });

        targetChannel.send({ embeds: [levelUpEmbed] });
      }
      const rewardRoleId = levelRewards[userData.level];
      if (rewardRoleId) {
        const role = guild.roles.cache.get(rewardRoleId);
        if (role) {
          const member = guild.members.cache.get(userId);
          if (member) {
            await member.roles.add(role);
            const roleEmbed = new EmbedBuilder().setColor(0xf7f7f7).setTitle(`> Role Awarded! ${message.author.username}`).setDescription(`${message.author}, kamu mendapatkan role **${role.name}**! 🎉`).setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif").setFooter({ text: "Terus aktif untuk mendapatkan lebih banyak role!" });

            targetChannel?.send({ embeds: [roleEmbed] });
          }
        }
      }
    }

    // Simpan data
    saveUserData(userId, userData.xp, userData.level, userCooldowns.get(userId));
  } catch (error) {
    console.error("Error handling messageCreate:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const member = interaction.options.getUser("member") || interaction.user;

  if (interaction.commandName === "level") {
    const userId = member.id;

    try {
      // Dapatkan data user (asynchronous)
      const userData = await getUserData(userId);

      if (!userData) {
        const embed = new EmbedBuilder().setColor(0xff0000).setTitle(`> Level info ${interaction.user.username}`).setDescription("kamu belum memiliki data leveling. kirim pesan untuk mulai mengumpulkan xp!").setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif").setFooter({ text: "Mulai kirim pesan untuk mengumpulkan xp!" });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xf7f7f7)
        .setTitle(`> Level info ${interaction.user.username}`)
        .setDescription(`**level saat ini:** ${userData.level}\n**xp saat ini:** ${userData.xp}/${levelUpXp(userData.level)}`)
        .setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif")
        .setFooter({ text: "terus aktif untuk naikan level kamuu!" });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error generating level info:", error);
      await interaction.reply({
        content: "terjadi kesalahan saat menampilkan info level.",
        ephemeral: true,
      });
    }
  }

  if (interaction.commandName === "level-member") {
    const userId = interaction.options.getUser("member").id;

    try {
      const userData = await getUserData(userId);

      if (!userData) {
        const embed = new EmbedBuilder().setColor(0xff0000).setTitle(`> Level info ${interaction.user.username}`).setDescription("kamu belum memiliki data leveling. kirim pesan untuk mulai mengumpulkan xp!").setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif").setFooter({ text: "Mulai kirim pesan untuk mengumpulkan xp!" });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xf7f7f7)
        .setTitle(`> Level info ${interaction.options.getUser("member").username}`)
        .setDescription(`**level saat ini:** ${userData.level}\n**xp saat ini:** ${userData.xp}/${levelUpXp(userData.level)}`)
        .setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif");
      // .setFooter({ text: "terus aktif untuk naikan level kamuu!" });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error generating level info:", error);
      await interaction.reply({
        content: "terjadi kesalahan saat menampilkan info level.",
        ephemeral: true,
      });
    }
  }

  async function getLeaderboardData() {
    try {
      const [results] = await db.promise().query("SELECT user_id, level, xp FROM levels ORDER BY level DESC, xp DESC LIMIT 3");
      return results;
    } catch (err) {
      console.error("Error fetching leaderboard from database:", err);
      return [];
    }
  }

  if (interaction.commandName === "leaderboard") {
    try {
      await interaction.guild.members.fetch();
      const leaderboard = await getLeaderboardData();

      const channel = interaction.client.channels.cache.get("1314371530204905584");
      if (!leaderboard.length) {
        return channel.send({ content: "Leaderboard kosong. Belum ada yang mengumpulkan XP." });
      }

      const leaderboardMessage = leaderboard.map((user, index) => 
        `**#${index + 1}** <@${user.user_id}> - Level: ${user.level} - XP: ${user.xp}`
      ).join("\n");

      const leaderboardEmbed = new EmbedBuilder()
        .setColor(0xf7f7f7)
        .setTitle("> BEST OF 3")
        .setDescription(leaderboardMessage)
        .setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif")
        .setFooter({ text: "terus aktif untuk naikan level kamuu!" });

      await channel.send({ embeds: [leaderboardEmbed] });
      await interaction.reply({ content: "Leaderboard berhasil dikirim!", ephemeral: true });
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      await interaction.client.channels.cache.get("1314371530204905584").send({
        content: "Terjadi kesalahan saat menampilkan leaderboard.",
      });
    }
  }

  if (interaction.commandName === "level-set" || interaction.commandName === "level-add" || interaction.commandName === "xp-set" || interaction.commandName === "xp-add" || interaction.commandName === "level-reset") {
    if (client.guilds.cache.get(process.env.GUILD_ID).members.cache.get(interaction.user.id).roles.cache.has("1314579201759907865")) {
      const targetUser = interaction.options.getUser("member") || interaction.user; // Dapatkan user yang dituju
      const userData = await getUserData(targetUser.id); // Gunakan ID dari targetUser

      if (interaction.commandName === "level-set") {
        const level = interaction.options.getInteger("level");
        if (!level) return interaction.reply({ content: "Level harus diisi.", ephemeral: true });

        userData.level = level;
        await interaction.reply({
          content: `Level ${targetUser.username} telah diatur menjadi level ${level}.`,
          ephemeral: true,
        });
      }

      if (interaction.commandName === "level-add") {
        const level = interaction.options.getInteger("level");
        if (!level) return interaction.reply({ content: "Level yang ditambahkan harus diisi.", ephemeral: true });

        userData.level += level;
        await interaction.reply({
          content: `Level ${targetUser.username} telah ditambahkan ${level}. Level sekarang: ${userData.level}.`,
          ephemeral: true,
        });
      }

      if (interaction.commandName === "xp-set") {
        const xp = interaction.options.getInteger("xp");
        if (!xp) return interaction.reply({ content: "XP harus diisi.", ephemeral: true });

        userData.xp = xp;
        await interaction.reply({
          content: `XP ${targetUser.username} telah diatur menjadi ${xp}.`,
          ephemeral: true,
        });
      }

      if (interaction.commandName === "xp-add") {
        const xp = interaction.options.getInteger("xp");
        if (!xp) return interaction.reply({ content: "XP yang ditambahkan harus diisi.", ephemeral: true });

        userData.xp += xp;
        await interaction.reply({
          content: `XP ${targetUser.username} telah ditambahkan ${xp}. XP sekarang: ${userData.xp}.`,
          ephemeral: true,
        });
      }

      saveUserData(targetUser.id, userData.xp, userData.level, userData.lastMessage);
    } else {
      interaction.reply({ content: "Kamu tidak memiliki akses untuk menggunakan perintah ini.", ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);

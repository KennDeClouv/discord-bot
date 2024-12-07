const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder().setName("level").setDescription("Tampilkan level dan XP kamu."),
  new SlashCommandBuilder()
    .setName("level-member")
    .setDescription("Tampilkan level dan XP member tertentu.")
    .addUserOption((option) => option.setName("member").setDescription("Pilih member").setRequired(true)),
  new SlashCommandBuilder()
    .setName("level-set")
    .setDescription("Setel level member tertentu")
    .addUserOption((option) => option.setName("member").setDescription("Pilih member").setRequired(true))
    .addIntegerOption((option) => option.setName("level").setDescription("Level yang ingin disetel").setRequired(true)),
  new SlashCommandBuilder()
    .setName("level-add")
    .setDescription("Tambah level member tertentu")
    .addUserOption((option) => option.setName("member").setDescription("Pilih member").setRequired(true))
    .addIntegerOption((option) => option.setName("level").setDescription("Level yang ingin ditambahkan").setRequired(true)),
  new SlashCommandBuilder()
    .setName("xp-set")
    .setDescription("Setel XP member tertentu")
    .addUserOption((option) => option.setName("member").setDescription("Pilih member").setRequired(true))
    .addIntegerOption((option) => option.setName("xp").setDescription("XP yang ingin disetel").setRequired(true)),
  new SlashCommandBuilder()
    .setName("xp-add")
    .setDescription("Tambah XP member tertentu")
    .addUserOption((option) => option.setName("member").setDescription("Pilih member").setRequired(true))
    .addIntegerOption((option) => option.setName("xp").setDescription("XP yang ingin ditambahkan").setRequired(true)),
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Memulai proses deploy commands...");
    const commandData = commands.map((command) => command.toJSON());
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandData });
    console.log("Slash command berhasil terdaftar!");
  } catch (error) {
    console.error(error);
  }
})();

const { AttachmentBuilder } = require("discord.js");
const generateWelcomeMessageIn = (useravatar, username) => {
  const imageUrl = `https://api.discorddevtools.xyz/welcome-image-generator/generate.png?title=haloo&username=${username}&background=https://i.ibb.co/dftpc49/png.png&titleColor=fff&text=selamat+datangg+di+RPL+GUYS!&textColor=fff&image=${useravatar}`;
  const attachment = new AttachmentBuilder(imageUrl);
  return {
    files: [attachment],
  };
};
module.exports = { generateWelcomeMessageIn };
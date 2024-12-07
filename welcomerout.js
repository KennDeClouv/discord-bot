const { AttachmentBuilder } = require("discord.js");
const generateWelcomeMessageOut = (useravatar, username) => {
  const imageUrl = `https://api.discorddevtools.xyz/welcome-image-generator/generate.png?title=huhuu....😭&username=${username}&background=https://i.ibb.co.com/dftpc49/png.png&titleColor=fff&text=kami+akan+merindukan+mu😭😭😭&textColor=fff&image=${useravatar}`;
  const attachment = new AttachmentBuilder(imageUrl);
  return {
    files: [attachment],
  };
};
module.exports = { generateWelcomeMessageOut };
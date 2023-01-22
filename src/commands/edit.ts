import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Command } from "../client";
import { editImage } from "../utils";

export const edit: Command = {
  command: new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit a picture using AI.")
    .addStringOption((option) => {
      return option
        .setName("prompt")
        .setDescription("The prompt to use.")
        .setRequired(true);
    })
    .addAttachmentOption((option) => {
      return option.setName("image").setDescription("The image to edit.");
    })
    .addStringOption((option) => {
      return option
        .setName("image_url")
        .setDescription("The image url to edit.");
    })
    .addBooleanOption((option) => {
      return option
        .setName("fix-faces")
        .setDescription("Fix faces in the image");
    })
    .addBooleanOption((option) => {
      return option.setName("upscale").setDescription("Upscale the image");
    })
    .addIntegerOption((option) => {
      return option
        .setName("steps")
        .setMaxValue(100)
        .setMinValue(1)
        .setDescription("The number of steps to take");
    })
    .addIntegerOption((option) => {
      return option
        .setName("prompt-strength")
        .setDescription("The strength of the prompt");
    })
    .addStringOption((option) => {
      return option
        .setName("negative-prompt")
        .setDescription("The negative prompt to use");
    })
    .addStringOption((option) => {
      return option.setName("seed").setDescription("The seed to use");
    })
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply();
    if (!interaction.isChatInputCommand()) {
      return;
    }
    const attachmentImageURL =
      interaction.options.getAttachment("image")?.proxyURL;
    const directImageURL = interaction.options.getString("image_url");
    const prompt = interaction.options.getString("prompt");
    const steps = interaction.options.getInteger("steps") || 25;
    const promptStrength = interaction.options.getInteger("prompt-strength");
    const negativePrompt = interaction.options.getString("negative-prompt");
    const seed = interaction.options.getString("seed");
    const fixFaces = interaction.options.getBoolean("fix-faces");
    const upscale = interaction.options.getBoolean("upscale");

    const imageURL = attachmentImageURL || directImageURL;
    if (!imageURL) {
      return interaction.editReply({
        content: "No image provided.",
      });
    }

    if (!prompt) {
      return interaction.editReply({
        content: "No prompt provided.",
      });
    }

    const { filePath } = await editImage({
      imageURL,
      prompt,
      steps,
      promptStrength,
      negativePrompt,
      seed,
      fixFaces,
      upscale,
    });

    if (!filePath) {
      return interaction.editReply({
        content: "An error occurred while editing the image.",
      });
    }

    const attachment = new AttachmentBuilder(filePath);

    return interaction.editReply({
      content: "Here is your edited image.",
      files: [attachment],
    });
  },
};

import { GatewayIntentBits } from "discord.js";
import { CustomClient } from "./client";
import { commands } from "./commands";
import { config } from "./config";

const client = new CustomClient(
  {
    intents: [GatewayIntentBits.Guilds],
  },
  {
    commands: commands,
  }
);

console.log("Starting discord client...");

client.login(config.discordToken);

client.on("ready", async () => {
  await client.start();
  console.log(`Bot started!`);
});

import { REST, Routes } from "discord.js";
import { commands } from "../commands";
import { config } from "../config";

const rest = new REST({
  version: "10",
}).setToken(config.discordToken);

rest
  .put(Routes.applicationCommands(config.discordApplicationId), {
    body: commands.map((item) => item.command),
  })
  .then((data: any) =>
    console.info(`Successfully registered ${data.length} commands.`)
  )
  .catch(console.error);

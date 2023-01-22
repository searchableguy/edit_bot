import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
  Events,
  SlashCommandBuilder,
} from "discord.js";

export interface Command {
  command: SlashCommandBuilder;
  execute(interaction: CommandInteraction): Promise<unknown> | unknown;
}

export interface CustomClientOptions {
  commands?: Command[];
}

export class CustomClient extends Client {
  commands: Collection<string, Command>;
  constructor(options: ClientOptions, { commands }: CustomClientOptions) {
    super(options);
    this.commands = new Collection(
      commands?.map((item) => [item.command.name.toLowerCase(), item])
    );
  }

  start() {
    this.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        const command = this.commands.get(interaction.commandName);
        command?.execute(interaction);
        return;
      }
    });
  }
}

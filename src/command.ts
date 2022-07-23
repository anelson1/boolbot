import { BaseInteraction, ChatInputApplicationCommandData, Client } from 'discord.js'

export interface ChatCommand extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: any) => void
}

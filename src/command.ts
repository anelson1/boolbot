import { ChatInputApplicationCommandData, Client } from 'discord.js'

export interface ChatCommand extends ChatInputApplicationCommandData {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	run: (client: Client, interaction: any) => void
}

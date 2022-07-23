import { CommandInteraction, Client } from 'discord.js'
import { ChatCommand } from '../command'

export const Hello: ChatCommand = {
  name: 'hello',
  description: 'Returns a greeting',
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = 'Hello there!'

    await interaction.followUp({
      ephemeral: true,
      content,
    })
  },
}

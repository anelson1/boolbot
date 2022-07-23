import { ChatInputCommandInteraction, Client, CommandInteraction, Interaction } from 'discord.js'
import { handleBoolResponse } from '../helpers/boolhandler'
import { Commands } from '../commands'

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: any) => {
    if (interaction.isButton()) {
      handleBoolResponse(interaction)
    }
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction)
    }
  })
}

const handleSlashCommand = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName)
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occurred' })
    return
  }

  await interaction.deferReply()

  slashCommand.run(client, interaction)
}
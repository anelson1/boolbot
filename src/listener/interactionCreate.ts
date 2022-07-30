import { ButtonInteraction, ChatInputCommandInteraction, Client } from 'discord.js'
import { handleBoolResponse } from '../helpers/boolhandler'
import { handleNotDead } from '../helpers/notdeadhandler'
import { Commands } from '../commands'

export default (client: Client): void => {
	client.on('interactionCreate', async (interaction) => {
		if (interaction.isButton()) {
			interaction = interaction as ButtonInteraction
			if (interaction.customId == 'notdead') {
				handleNotDead(interaction, client)
			} else {
				handleBoolResponse(interaction, client)
			}
		}
		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			await handleSlashCommand(client, interaction as ChatInputCommandInteraction)
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

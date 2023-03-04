import { ButtonInteraction, ChatInputCommandInteraction, Client, SelectMenuInteraction } from 'discord.js'
import { handleBoolButtonResponse, handleBoolResponse } from '../helpers/boolHandler'
import { handleNotDead } from '../helpers/notdeadhandler'
import { Commands } from '../commands'
import { handleScheduleResponse } from '../helpers/schedulehandler'

export default (client: Client): void => {
	client.on('interactionCreate', async (interaction) => {
		if (interaction.isButton()) {
			interaction = interaction as ButtonInteraction
			if (interaction.customId == 'notdead') {
				handleNotDead(interaction, client)
			} else {
				handleBoolButtonResponse(interaction, client)
			}
		}
		if (interaction.isSelectMenu()) {
			interaction = interaction as SelectMenuInteraction
			if (interaction.customId === 'boolSelect') {
				handleBoolResponse(interaction, client)
			} else {
				handleScheduleResponse(interaction, client)
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

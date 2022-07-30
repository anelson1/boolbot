import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { ChatCommand } from '../command'

export const NotDead: ChatCommand = {
	name: 'notdead',
	description: 'Sends a not dead message in the chat',
	run: async (client: Client, interaction) => {
		const embed = new EmbedBuilder()
			.setColor(0x065535)
			.setTitle('Welcome to Bois')
			.setAuthor({ name: interaction.member.nickname as string, iconURL: interaction.member.user.avatarURL() as string })
			.setDescription('Please click the button to ensure you are not dead')
			.setTimestamp()
			.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setCustomId('notdead').setLabel('Not Dead').setStyle(ButtonStyle.Secondary),
		)
		await interaction.followUp({ embeds: [embed], components: [row] })
	},
}

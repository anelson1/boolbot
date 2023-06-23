import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, APIEmbedField, SelectMenuBuilder } from 'discord.js'
import { ChatCommand } from '../command'
import { nelsonNetIcon } from '../helpers/boolHandler'
import { PrismaClient } from '@prisma/client'
import { getDays } from '../helpers/boolHandler'

const prisma = new PrismaClient()
export const ListBool: ChatCommand = {
	name: 'listbool',
	description: 'Lists everyone who was asked to bool and their responses',
	run: async (client: Client, interaction) => {
		const boolers = await prisma.boolRSVP.findMany()
		if (boolers.length) {
			const embed = new EmbedBuilder()
				.setColor(0xff9733)
				.setTitle('Bool List V2')
				.setDescription(
					`The list of people who will be boolin this upcoming ${boolers[0].boolDate}. If you are not on this list and would like to attend, please click the boolin button below`,
				)
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })
			boolers.forEach((booler) => {
				embed.addFields({ name: ':white_check_mark: - ' + booler.username, value: '---------------------------------' })
			})
			const sortOrder = [':white_check_mark:', ':x:', ':grey_question:']
			const sortedBoolers: APIEmbedField[] = embed.data.fields?.slice() as APIEmbedField[]
			embed.setFields(
				sortedBoolers.sort((a, b) => (sortOrder.indexOf(a.name.slice(0, a.name.indexOf(' '))) < sortOrder.indexOf(b.name.slice(0, b.name.indexOf(' '))) ? -1 : 1)),
			)
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId('y').setLabel('Boolin!').setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId('n').setLabel('Dippin...').setStyle(ButtonStyle.Danger),
			)
			await interaction.followUp({ embeds: [embed], components: [row] })
		} else {
			const embed = new EmbedBuilder()
				.setColor(0xff9733)
				.setTitle('Bool List V2')
				.setDescription('There is currently no successful bool in progress... Maybe select the days you are available first.')
				.addFields({ name: 'Reminder', value: 'A bool can only occur when three or more people have a day in common. To see current days, use /listbooldays' })
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })
			const row = new ActionRowBuilder().addComponents(
				new SelectMenuBuilder()
					.setCustomId('boolSelect')
					.setPlaceholder('No Days')
					.setMinValues(0)
					.setMaxValues(7)
					.addOptions(
						getDays().map((day) => {
							return {
								label: day,
								value: day,
							}
						}),
					),
			)
			await interaction.followUp({ embeds: [embed], components: [row] })
		}
	},
}

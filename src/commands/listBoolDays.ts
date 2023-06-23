import { Client, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from 'discord.js'
import { ChatCommand } from '../command'
import { PrismaClient } from '@prisma/client'
import { getDays } from '../helpers/boolHandler'

const prisma = new PrismaClient()

export const ListBoolDays: ChatCommand = {
	name: 'listbooldays',
	description: 'Lists the days each person can bool',
	run: async (client: Client, interaction) => {
		const boolData = await prisma.boolDays.findMany()
		const embed = new EmbedBuilder()
			.setColor(0x20603d)
			.setTitle('Bool Days List')
			.setDescription('The people who were asked to bool this week')
			.setTimestamp()
			.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
		boolData.forEach((booler) => {
			if (booler.days.length > 0) {
				embed.addFields({ name: `${booler.username} can bool on:`, value: JSON.parse(booler.days).join().replaceAll(',', ' :small_orange_diamond: ') })
			} else {
				embed.addFields({ name: `${booler.username} has not selected days yet:`, value: 'Please use the box below to select your days' })
			}
		})

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
	},
}

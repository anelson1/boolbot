import { Client, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from 'discord.js'
import { ChatCommand } from '../command'
import fs from 'fs'
import { BoolResponse } from './bool'

export const ListBoolDays: ChatCommand = {
	name: 'listbooldays',
	description: 'Lists the days each person can bool',
	run: async (client: Client, interaction) => {
		fs.readFile('./src/data/boolDayData.json', 'utf8', async (err, content) => {
			const boolData = JSON.parse(content) as BoolResponse[]
			const embed = new EmbedBuilder()
				.setColor(0x20603d)
				.setTitle('Bool Days List')
				.setDescription('The people who were asked to bool this week')
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
			boolData.forEach((booler) => {
				if (booler.days.length > 0) {
					embed.addFields({ name: `${booler.name} can bool on:`, value: booler.days.join().replaceAll(',', ', ') })
				} else {
					embed.addFields({ name: `${booler.name} has not selected days yet:`, value: 'Please use the box below to select your days' })
				}
			})

			const row = new ActionRowBuilder().addComponents(
				new SelectMenuBuilder().setCustomId('boolSelect').setPlaceholder('No Days').setMinValues(0).setMaxValues(7).addOptions(
					{
						label: 'Monday',
						value: 'monday',
					},
					{
						label: 'Tuesday',
						value: 'tuesday',
					},
					{
						label: 'Wednesday',
						value: 'wednesday',
					},
					{
						label: 'Thursday',
						value: 'thursday',
					},
					{
						label: 'Friday',
						value: 'friday',
					},
					{
						label: 'Saturday',
						value: 'saturday',
					},
					{
						label: 'Sunday',
						value: 'sunday',
					},
				),
			)
			await interaction.followUp({ embeds: [embed], components: [row] })
		})
	},
}

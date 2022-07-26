import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, APIEmbedField } from 'discord.js'
import { ChatCommand } from '../command'
import { BoolData } from '../helpers/boolhandler'
import fs from 'fs'

export const ListBool: ChatCommand = {
	name: 'listbool',
	description: 'Lists everyone who was asked to bool and their responses',
	run: async (client: Client, interaction) => {
		fs.readFile('./src/data/booldata.json', 'utf8', async (err, content) => {
			const boolData = JSON.parse(content) as BoolData
			const date = boolData.date
			const boolers = boolData.boolers

			const embed = new EmbedBuilder()
				.setColor(0xff9733)
				.setTitle('Bool List')
				.setDescription('The list of people who were asked to bool on ' + date)
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
			boolers.forEach((booler) => {
				let fieldText = ''
				if (booler.RSVP === 'NA') {
					fieldText = ':grey_question: - ' + booler.name
				} else if (booler.RSVP === 'Y') {
					fieldText = ':white_check_mark: - ' + booler.name
				} else if (booler.RSVP === 'N') {
					fieldText = ':x: - ' + booler.name
				}
				embed.addFields({ name: fieldText, value: '---------------------------------' })
			})
			let sortOrder = [':white_check_mark:', ':x:', ':grey_question:']
			let sortedBoolers : APIEmbedField[] = embed.data.fields?.slice() as APIEmbedField[];
			embed.setFields(sortedBoolers.sort((a, b) => (sortOrder.indexOf(a.name.slice(0, a.name.indexOf(' '))) < sortOrder.indexOf(b.name.slice(0, b.name.indexOf(' '))) ? -1 : 1)))
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setCustomId('y').setLabel('Yes').setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId('n').setLabel('No').setStyle(ButtonStyle.Danger),
			)
			await interaction.followUp({ embeds: [embed], components: [row] })
		})
	},
}

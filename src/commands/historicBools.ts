import { Client, EmbedBuilder } from 'discord.js'
import { ChatCommand } from '../command'
import { nelsonNetIcon } from '../helpers/boolHandler'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const HistoricBools: ChatCommand = {
	name: 'historicbools',
	description: 'Lists all previous bools and who agreed to attend',
	run: async (client: Client, interaction) => {
		const boolers = await prisma.historicBools.findMany()
		if (boolers.length) {
			const embed = new EmbedBuilder()
				.setColor(0xff9733)
				.setTitle('Bool List V2')
				.setDescription('The historic bool record')
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })
			boolers.forEach((record) => {
				embed.addFields({ name: record.boolDate, value: JSON.parse(record.boolers).join().replaceAll(',', ' :small_orange_diamond: ') })
			})

			await interaction.followUp({ embeds: [embed] })
		} else {
			const embed = new EmbedBuilder()
				.setColor(0xff9733)
				.setTitle('Bool List V2')
				.setDescription('There is currently no data. There must be a bool first')
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })

			await interaction.followUp({ embeds: [embed] })
		}
	},
}

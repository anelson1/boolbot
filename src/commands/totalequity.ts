import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'
import { ChatCommand } from '../command'
type StakeholderData = {
	name: string
	count: number
}
export const TotalEquity: ChatCommand = {
	name: 'equity',
	description: 'see the chat equity of everyone in the channel for the given last messages',
	options: [
		{
			name: 'limit',
			type: 3,
			description: 'How many messages back to calculate',
			required: true,
		},
	],
	run: async (client: Client, interaction) => {
		const initalLimit = Number(interaction.options._hoistedOptions[0].value)
		if (isNaN(initalLimit)) {
			const embed = new EmbedBuilder()
				.setColor(0xff0000)
				.setTitle('Equity')
				.setDescription('Please enter a number')
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2022', iconURL: client.user?.avatarURL() as string })
			await interaction.followUp({ embeds: [embed] })
		} else {
			const chan = interaction.channel as TextChannel
			const stakeholders: Array<StakeholderData> = []
			let alreadyIn = false
			let message = await chan.messages.fetch({ limit: 1 }).then((messagePage) => (messagePage.size === 1 ? messagePage.at(0) : null))
			let messagesCounted = 0
			const messagesCountedHistory = []
			messagesCountedHistory.push(messagesCounted)
			let limit = Number(interaction.options._hoistedOptions[0].value)
			try {
				while (message) {
					const limitToFetch = limit >= 100 ? 100 : limit
					console.log(limit, limitToFetch)
					if (limitToFetch > 0) {
						await chan.messages.fetch({ limit: limitToFetch, before: message.id }).then((messagePage) => {
							messagePage.forEach((msg) => {
								alreadyIn = false
								const username = msg.author.username
								stakeholders.forEach((entry) => {
									if (entry.name === username) {
										entry.count = (entry.count as number) + 1
										alreadyIn = true
									}
								})
								if (!alreadyIn) {
									stakeholders.push({ name: username, count: 1 })
								}
								message = messagePage.size > 0 ? messagePage.at(messagePage.size - 1) : null
								messagesCounted++
							})
							limit = limit - 100
						})
						console.log(messagesCounted)
						const lastRoundMessageCount = messagesCountedHistory.pop()
						messagesCountedHistory.push(messagesCounted)
						if (messagesCounted === initalLimit || lastRoundMessageCount === messagesCounted) {
							break
						}
					} else {
						break
					}
				}
			} catch (e) {
				await interaction.followUp('You entered a number that is way to high')
				console.log(e)
			}
			stakeholders.sort((a, b) => b.count - a.count)
			console.log(stakeholders)
			const embed = new EmbedBuilder()
				.setColor(0x118c4f)
				.setTitle('Equity')
				.setDescription(`The total chat equity for the last ${messagesCounted} messages`)
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2022', iconURL: client.user?.avatarURL() as string })
			stakeholders.forEach((entry, index) => {
				let fieldText = ''
				if (index === 0) {
					fieldText = `:first_place: ${entry.name} - ${(entry.count / messagesCounted) * 100}%`
				} else if (index === 1) {
					fieldText = `:second_place: ${entry.name} - ${(entry.count / messagesCounted) * 100}%`
				} else if (index === 2) {
					fieldText = `:third_place: ${entry.name} - ${(entry.count / messagesCounted) * 100}%`
				} else {
					fieldText = `${entry.name} - ${(entry.count / messagesCounted) * 100}%`
				}

				embed.addFields({ name: fieldText, value: '---------------------------------' })
			})
			console.log(embed)
			await interaction.followUp({ embeds: [embed] })
		}
	},
}

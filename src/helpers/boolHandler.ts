import { ButtonInteraction, Client, EmbedBuilder, SelectMenuInteraction, TextChannel } from 'discord.js'
import fs from 'fs'
import { BoolResponse } from '../commands/bool'
import { BOOL_CHANNEL_ID } from '../constants'

export interface BoolRSVP {
	id: string
	RSVP: boolean
	name: string
}
export interface BoolSchedule {
	day: string
	boolRSVP: BoolRSVP[]
}
export const nelsonNetIcon = 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1'
export const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const calculateBoolIntersect = (gamers: BoolResponse[]): { day: string; count: number }[] => {
	const arr: string[][] = []
	gamers.forEach((gamer) => {
		arr.push(gamer.days)
	})
	const countList: { day: string; count: number }[] = []
	days.forEach((day) => {
		let dayCount = 0
		arr.forEach((dayList) => {
			dayList.forEach((dayInList) => {
				if (dayInList === day) {
					dayCount++
				}
			})
		})
		countList.push({
			day,
			count: dayCount,
		})
	})
	return countList
}

const checkResponses = (boolData: BoolResponse[]) => {
	const validBoolers: BoolResponse[] = []
	boolData.forEach((booler) => {
		if (booler.days.length > 0) {
			validBoolers.push(booler)
		}
	})
	return calculateBoolIntersect(validBoolers)
}

const initiateBoolSchedule = (day: string, boolData: BoolResponse[], interaction: SelectMenuInteraction) => {
	const filteredBoolers = boolData.filter((booler) => booler.days.includes(day))
	const boolRSVP = filteredBoolers.map((booler) => {
		return {
			id: booler.id,
			RSVP: true,
			name: booler.name,
		}
	})
	fs.writeFileSync('./src/data/boolData.json', JSON.stringify({ day, boolRSVP }))
	const embed = new EmbedBuilder()
		.setTitle('Finalized Bool V2 RSVP')
		.setColor(0xd6ae01)
		.setAuthor({ name: 'The Boolers', iconURL: nelsonNetIcon })
		.setThumbnail(nelsonNetIcon)
		.setTimestamp()
		.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })
		.setDescription(`${filteredBoolers.map((booler) => booler.name).join(', ')} will be boolin on ${day} at 4:00 Standard Bool Time`)
		.addFields({ name: 'Reminder', value: 'Use /listbool to see the most updated active bool list' })
	interaction.reply({ embeds: [embed] })
}

export const handleBoolResponse = async (interaction: SelectMenuInteraction, client: Client) => {
	const user = interaction.user
	const newEntry: BoolResponse = { id: interaction.user.id, name: '', days: interaction.values }
	fs.readFile('./src/data/boolDayData.json', 'utf8', (_, content) => {
		const boolFile = JSON.parse(content) as BoolResponse[]
		let alreadyIn = false
		boolFile.forEach((booler) => {
			if (booler.id === newEntry.id) {
				booler.days = newEntry.days
				alreadyIn = true
			}
		})
		if (!alreadyIn) {
			newEntry.name = user.username
			boolFile.push(newEntry)
		}
		const boolers = JSON.stringify(boolFile)
		fs.writeFileSync('./src/data/boolDayData.json', boolers)
		const boolDays = checkResponses(boolFile)
		const validDays = boolDays.filter((dayEntry) => dayEntry.count >= 3)
		if (validDays.length) {
			const maxDay = Math.max(...validDays.map((day) => day.count))
			const selectedDay = validDays.find((day) => day.count === maxDay) as { day: string; count: number }
			initiateBoolSchedule(selectedDay.day, boolFile, interaction)
		} else {
			const currentBoolData = fs.readFileSync('./src/data/boolData.json')
			fs.writeFileSync('./src/data/boolData.json', '')
			if (currentBoolData.length > 0) {
				const embed = new EmbedBuilder()
					.setTitle('Bool RSVP')
					.setColor(0xff0000)
					.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
					.setThumbnail(user.avatarURL())
					.setTimestamp()
					.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
					.setDescription(`${user.username} has killed the bool...`)
				interaction.reply({ embeds: [embed] })
				const boolChannel = client.channels.cache.get(BOOL_CHANNEL_ID) as TextChannel
				if (interaction.channelId !== boolChannel.id) {
					boolChannel.send({ embeds: [embed] })
				}
			} else {
				const embed = new EmbedBuilder()
					.setTitle('Bool RSVP')
					.setColor(0x6b9fcb)
					.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
					.setThumbnail(user.avatarURL())
					.setTimestamp()
					.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
					.setDescription(`${user.username} can bool this week on ${newEntry.days.join().replaceAll(',', ', ')}`)
				interaction.reply({ embeds: [embed] })
				const boolChannel = client.channels.cache.get(BOOL_CHANNEL_ID) as TextChannel
				if (interaction.channelId !== boolChannel.id) {
					boolChannel.send({ embeds: [embed] })
				}
			}
		}
	})
}

export const handleBoolButtonResponse = async (interaction: ButtonInteraction, client: Client) => {
	const user = interaction.user
	const newEntry: BoolRSVP = { id: interaction.user.id, name: '', RSVP: interaction.customId === 'y' ? true : false }
	fs.readFile('./src/data/boolData.json', 'utf8', (_, content) => {
		const boolFile = JSON.parse(content) as BoolSchedule

		if (newEntry.RSVP) {
			let alreadyIn = false
			boolFile.boolRSVP.forEach((booler) => {
				if (booler.id === newEntry.id) {
					alreadyIn = true
				}
			})
			if (!alreadyIn) {
				newEntry.name = user.username
				boolFile.boolRSVP.push(newEntry)
			}
		} else {
			const boolerToRemove = boolFile.boolRSVP.findIndex((booler) => booler.id === newEntry.id)
			if (boolerToRemove !== -1) {
				boolFile.boolRSVP.splice(boolerToRemove, 1)
			} else {
				const embed = new EmbedBuilder()
					.setTitle('Bool V2 RSVP')
					.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
					.setThumbnail(user.avatarURL())
					.setTimestamp()
					.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })
				embed.setDescription('You already are not boolin.')
				embed.setColor(0xff0000)
				interaction.reply({ embeds: [embed], ephemeral: true })
				return
			}
		}
		if (boolFile.boolRSVP.length < 3) {
			const embed = new EmbedBuilder()
				.setTitle('Bool V2 RSVP')
				.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
				.setThumbnail(user.avatarURL())
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2022', iconURL: nelsonNetIcon })
			embed.setDescription(user.username + ' has killed the bool...')
			embed.setColor(0xff0000)
			interaction.reply({ embeds: [embed] })
			const boolChannel = client.channels.cache.get(BOOL_CHANNEL_ID) as TextChannel
			if (interaction.channelId !== boolChannel.id) {
				boolChannel.send({ embeds: [embed] })
			}
			fs.writeFileSync('./src/data/boolData.json', '')
		} else {
			const boolers = JSON.stringify(boolFile)
			const embed = new EmbedBuilder()
				.setTitle('Bool V2 RSVP')
				.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
				.setThumbnail(user.avatarURL())
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2022', iconURL: nelsonNetIcon })
			if (interaction.customId === 'y') {
				newEntry.RSVP = true
				embed.setDescription(user.username + ' is joining the bool!')
				embed.setColor(0x00ff00)
			} else {
				newEntry.RSVP = false
				embed.setDescription(user.username + ' is dipping out of the bool...')
				embed.setColor(0xff0000)
			}
			fs.writeFileSync('./src/data/boolData.json', boolers)
			interaction.reply({ embeds: [embed] })
			const boolChannel = client.channels.cache.get(BOOL_CHANNEL_ID) as TextChannel
			if (interaction.channelId !== boolChannel.id) {
				boolChannel.send({ embeds: [embed] })
			}
		}
	})
}

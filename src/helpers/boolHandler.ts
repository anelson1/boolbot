import { ButtonInteraction, Client, EmbedBuilder, SelectMenuInteraction, TextChannel } from 'discord.js'
import { BoolResponse } from '../commands/bool'
import { BOOL_CHANNEL_ID } from '../constants'
import { PrismaClient } from '@prisma/client'
import moment from 'moment'

const prisma = new PrismaClient()

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
export const getDays = () => {
	const days = []
	for (let i = 1; i <= 7; i++) {
		days.push(moment().add(i, 'days').format('dddd MMMM Do YYYY'))
	}
	return days
}

export const calculateBoolIntersect = (boolers: BoolResponse[]): { day: string; count: number }[] => {
	const arr: string[][] = []
	boolers.forEach((booler) => {
		arr.push(booler.days)
	})
	const countList: { day: string; count: number }[] = []
	getDays().forEach((day) => {
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

const checkResponses = async () => {
	const boolers = await prisma.boolDays.findMany()
	const validBoolers: BoolResponse[] = []
	boolers.forEach((booler) => {
		let availableDays
		try {
			availableDays = JSON.parse(booler.days)
		} catch {
			availableDays = ''
		}
		if (availableDays.length > 0) {
			validBoolers.push({
				id: booler.id,
				name: booler.username,
				days: availableDays,
			})
		}
	})
	return calculateBoolIntersect(validBoolers)
}

const initiateBoolSchedule = async (day: string, interaction: SelectMenuInteraction, client: Client) => {
	const boolers = await prisma.boolDays.findMany()
	const filteredBoolers = boolers.filter((booler) => {
		try {
			return JSON.parse(booler.days).includes(day)
		} catch {
			return ''
		}
	})
	for (const booler of filteredBoolers) {
		await prisma.boolRSVP.upsert({
			where: {
				id: booler.id,
			},
			update: {
				boolDate: day,
			},
			create: {
				id: booler.id,
				username: booler.username,
				isBooling: true,
				boolDate: day,
			}
		})
	}

	const embed = new EmbedBuilder()
		.setTitle('Finalized Bool V2 RSVP')
		.setColor(0xd6ae01)
		.setAuthor({ name: 'The Boolers', iconURL: nelsonNetIcon })
		.setThumbnail(nelsonNetIcon)
		.setTimestamp()
		.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })
		.setDescription(`${filteredBoolers.map((booler) => booler.username).join(', ')} will be boolin on ${day} at 4:00 (5:00 if Thursday) Standard Bool Time`)
		.addFields({ name: 'Reminder', value: 'Use /listbool to see the most updated active bool list' })
	acknowledgeBoolResponse(client, embed, interaction)
}

export const handleBoolResponse = async (interaction: SelectMenuInteraction, client: Client) => {
	const user = interaction.user
	const newEntry: BoolResponse = { id: interaction.user.id, name: '', days: interaction.values }
	const boolerResponse = await prisma.boolDays.findFirst({
		where: {
			id: newEntry.id,
		},
	})
	if (!boolerResponse) {
		await prisma.boolDays.create({
			data: {
				id: newEntry.id,
				username: user.username,
				days: JSON.stringify(newEntry.days),
			},
		})
	} else {
		await prisma.boolDays.update({
			where: {
				id: newEntry.id,
			},
			data: {
				days: JSON.stringify(newEntry.days),
			},
		})
	}
	const boolDays = await checkResponses()
	const validDays = boolDays.filter((dayEntry) => dayEntry.count >= 3)
	if (validDays.length) {
		const maxDay = Math.max(...validDays.map((day) => day.count))
		const selectedDay = validDays.find((day) => day.count === maxDay) as { day: string; count: number }
		initiateBoolSchedule(selectedDay.day, interaction, client)
	} else {
		const currentBoolData = await prisma.boolRSVP.findMany()
		await prisma.boolRSVP.deleteMany()
		let embed
		if (currentBoolData.length > 0) {
			embed = new EmbedBuilder()
				.setTitle('Bool RSVP')
				.setColor(0xff0000)
				.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
				.setThumbnail(user.avatarURL())
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
				.setDescription(`${user.username} has killed the bool...`)
		} else {
			embed = new EmbedBuilder()
				.setTitle('Bool RSVP')
				.setColor(0x6b9fcb)
				.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
				.setThumbnail(user.avatarURL())
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
				.setDescription(`${user.username} can bool this week on ${newEntry.days.join().replaceAll(',', ', ')}`)
		}
		acknowledgeBoolResponse(client, embed, interaction)
	}
}

export const handleBoolButtonResponse = async (interaction: ButtonInteraction, client: Client) => {
	const user = interaction.user
	const newEntry: BoolRSVP = { id: interaction.user.id, name: user.username, RSVP: interaction.customId === 'y' ? true : false }
	const embed = new EmbedBuilder()
		.setTitle('Bool V2 RSVP')
		.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
		.setThumbnail(user.avatarURL())
		.setTimestamp()
		.setFooter({ text: 'Nelson Net | 2022', iconURL: nelsonNetIcon })

	const booler = await prisma.boolRSVP.findFirst({
		where: {
			id: newEntry.id,
		},
	})
	if (!booler) {
		await prisma.boolRSVP.create({
			data: {
				id: newEntry.id,
				username: newEntry.name,
				isBooling: newEntry.RSVP,
				boolDate: '',
			},
		})
	} else if (!(newEntry.RSVP === booler.isBooling)) {
		console.log('diff res')

		await prisma.boolRSVP.update({
			where: {
				id: newEntry.id,
			},
			data: {
				isBooling: newEntry.RSVP,
			},
		})
	} else {
		console.log('same res')
		const repeatEmbed = new EmbedBuilder()
			.setTitle('Bool V2 RSVP')
			.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
			.setThumbnail(user.avatarURL())
			.setTimestamp()
			.setFooter({ text: 'Nelson Net | 2023', iconURL: nelsonNetIcon })
		repeatEmbed.setDescription(`You already are ${newEntry.RSVP ? '' : 'not'} boolin.`)
		repeatEmbed.setColor(0xff0000)
		interaction.reply({ embeds: [repeatEmbed], ephemeral: true })
		return
	}
	if (interaction.customId === 'y') {
		newEntry.RSVP = true
		embed.setDescription(user.username + ' is joining the bool!')
		embed.setColor(0x00ff00)
	} else {
		newEntry.RSVP = false
		embed.setDescription(user.username + ' is dipping out of the bool...')
		embed.setColor(0xff0000)
	}
	acknowledgeBoolResponse(client, embed, interaction)
}

const acknowledgeBoolResponse = (client: Client, embed: EmbedBuilder, interaction: ButtonInteraction | SelectMenuInteraction) => {
	const boolChannel = client.channels.cache.get(BOOL_CHANNEL_ID) as TextChannel
	interaction.reply({ content: `Your response has been recorded. Please see ${boolChannel.toString()} for the current bool status`, ephemeral: true })
	boolChannel.send({ embeds: [embed] })
}

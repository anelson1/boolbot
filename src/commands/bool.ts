import { Client, ActionRowBuilder, EmbedBuilder, SelectMenuInteraction, SelectMenuBuilder, Role } from 'discord.js'
import { ChatCommand } from '../command'
import { BOOLIN_ROLE_ID, SERVER_ID } from '../constants'
import { getDays } from '../helpers/boolHandler'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type BoolResponse = {
	id: string
	name: string | null
	days: string[]
}

const generateMessageContent = (interaction: SelectMenuInteraction): { embed: EmbedBuilder; row: ActionRowBuilder } => {
	const embed = new EmbedBuilder()
		.setColor(0x6b9fcb)
		.setTitle('Bool Invite')
		.setAuthor({ name: interaction.user.username as string, iconURL: interaction.user.avatarURL() as string })
		.setDescription(`${interaction.user.username} would like to bool this week. Once three people submit their days, a bool will be created`)
		.addFields({ name: 'Please select the days this week you are available to bool', value: 'You can select multiple', inline: true })
		.setTimestamp()
		.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
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
	return { embed, row }
}

const dmRoleMembers = async (role: Role, interaction: SelectMenuInteraction): Promise<BoolResponse[]> => {
	const boolData: BoolResponse[] = []
	role?.members.forEach((member) => {
		const scheduleEntry: BoolResponse = { id: member.id, name: member.nickname, days: [] }
		boolData.push(scheduleEntry)
		member.createDM().then((dm) => {
			const { embed, row } = generateMessageContent(interaction)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			dm.send({ embeds: [embed], components: [row] })
		})
	})
	return boolData
}

const saveBoolHistory = async () => {
	await prisma.boolDays.deleteMany()
	const previousBool = await prisma.boolRSVP.findMany({
		where: {
			isBooling: true,
		},
	})
	if (previousBool.length) {
		const previousBoolers: string[] = []
		previousBool.forEach((previousBooler) => {
			previousBoolers.push(previousBooler.username)
		})
		await prisma.historicBools.create({
			data: {
				boolDate: previousBool[0].boolDate,
				boolers: JSON.stringify(previousBoolers),
			},
		})
	}
	await prisma.boolRSVP.deleteMany()
}
export const Bool: ChatCommand = {
	name: 'bool',
	description: 'Ask the fellas to bool this week',
	run: async (client: Client, interaction) => {
		await saveBoolHistory()
		const guild = await client.guilds.fetch(SERVER_ID)
		await guild.members.fetch()
		const boolinRole = guild.roles.cache.get(BOOLIN_ROLE_ID)
		const boolData = await dmRoleMembers(boolinRole as Role, interaction)
		for (const booler of boolData) {
			await prisma.boolDays.create({
				data: {
					id: booler.id,
					username: booler.name as string,
					days: '',
				},
			})
		}
		const { embed, row } = generateMessageContent(interaction)

		await interaction.followUp({ embeds: [embed], components: [row] })
	},
}

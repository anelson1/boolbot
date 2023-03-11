import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, SelectMenuInteraction, SelectMenuBuilder, Role } from 'discord.js'
import { ChatCommand } from '../command'
import fs from 'fs'
import { BOOLIN_ROLE_ID, SERVER_ID } from 'src/constants'

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
export const Bool: ChatCommand = {
	name: 'bool',
	description: 'Ask the fellas to bool this week',
	run: async (client: Client, interaction) => {
		const guild = await client.guilds.fetch(SERVER_ID)
		await guild.members.fetch()
		const boolinRole = guild.roles.cache.get(BOOLIN_ROLE_ID)
		const boolData = await dmRoleMembers(boolinRole as Role, interaction)
		const data = JSON.stringify(boolData)
		fs.writeFile('./src/data/boolDayData.json', data, (err) => {
			if (err) {
				console.log(err)
			}
		})
		fs.writeFile('./src/data/boolData.json', '', (err) => {
			if (err) {
				console.log(err)
			}
		})

		const { embed, row } = generateMessageContent(interaction)

		await interaction.followUp({ embeds: [embed], components: [row] })
	},
}

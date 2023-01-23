import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, Role, SelectMenuBuilder  } from 'discord.js'
import { ChatCommand } from '../command'
import fs from 'fs'

export type GameResponse = {
	id: string
	name: string | null
	days: string[]
}

export type GameData = {
	game: string, 
	gamers: GameResponse[]
}

const generateMessageContent = (gameData: GameData, interaction: any): {embed: EmbedBuilder, row: ActionRowBuilder} => {
	const embed = new EmbedBuilder()
				.setColor(0x6b9fcb)
				.setTitle(`${gameData.game} Invite`)
				.setAuthor({ name: interaction.user.username as string, iconURL: interaction.user.avatarURL() })
				.setDescription(`${interaction.user.username} would like to play ${gameData.game} this week`)
				.addFields({ name: 'Please select the days this week you are available', value: 'You can select multiple', inline: true })
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
				const row = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId('select')
						.setPlaceholder('No Days')
						.setMinValues(0)
						.setMaxValues(7)
						.addOptions(
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
				return {embed, row}
}
const dmRoleMembers = async (gameData: GameData, role: Role, interaction: any): Promise<GameData>  => {
	role?.members.forEach((member) => {
		const scheduleEntry: GameResponse = { id: member.id, name: member.nickname, days: []}
		gameData.gamers.push(scheduleEntry)
		member.createDM().then((dm) => {
			const {embed, row} = generateMessageContent(gameData, interaction)
			//@ts-ignore
			dm.send({ embeds: [embed], components: [row] })
		})
	})
	return gameData
}
export const GameRSVP: ChatCommand = {
	name: 'gamersvp',
	description: 'Schedule the days of the week the gamers can game',
	options: [
		{
			name: 'game',
			type: 3,
			description: 'The game to schedule for',
			required: true,
		},
		{
			name: 'role',
			type: 3,
			description: 'The role name to message the members of',
			required: false,
		}
	],
	run: async (client: Client, interaction) => {
		const guild = await client.guilds.fetch('423937254046826496')
		const roleParam = interaction.options._hoistedOptions[1]?.value
		let gameData: GameData = {
			game: interaction.options._hoistedOptions[0].value,
			gamers: []
		}
		await guild.members.fetch()
		if(roleParam){
			const roles = await guild.roles.fetch()
			roles.forEach(async role => {
				if (role.name.toLowerCase() === roleParam.toLowerCase()){
					gameData = await dmRoleMembers(gameData, role, interaction)
				}
			})
		
		}
		
		const data = JSON.stringify(gameData)
		fs.writeFile('./src/data/gamedata.json', data, (err) => {
			if(err){
				console.log(err)
			}
		})
		const {embed, row} = generateMessageContent(gameData, interaction)
		await interaction.followUp({ embeds: [embed], components: [row] })
	},
}

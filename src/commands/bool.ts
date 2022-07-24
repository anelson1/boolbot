import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from 'discord.js'
import { ChatCommand } from '../command'
import fs from 'fs'

type BoolResponse = {
	id: string
	RSVP: string
	name: string | null
}

export const Bool: ChatCommand = {
	name: 'bool',
	description: 'Ask the fellas to bool on a given date',
	options: [
		{
			name: 'date',
			type: 3,
			description: 'The date on which to bool',
			required: true,
		},
	],
	run: async (client: Client, interaction) => {
		const guild = await client.guilds.fetch('423937254046826496')
		const boolData = {
			date: interaction.options._hoistedOptions[0].value,
			boolers: [] as Array<BoolResponse>,
		}
		await guild.members.fetch()
		const boolinRole = guild.roles.cache.get('855652264663318540')
		console.log(boolinRole?.name)
		boolinRole?.members.forEach((member) => {
			console.log(member.nickname)
			const newBooler: BoolResponse = { id: member.id, RSVP: 'NA', name: member.nickname }
			boolData.boolers.push(newBooler)
			member.createDM().then((dm) => {
				const embed = new EmbedBuilder()
					.setColor(0x350f4f)
					.setTitle('Bool Invite')
					.setAuthor({ name: member.nickname as string, iconURL: member.user.avatarURL() as string })
					.setDescription(member.nickname + ' Would like to bool on ' + interaction.options._hoistedOptions[0].value)
					.setTimestamp()
					.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
				dm.send({ embeds: [embed], components: [row] })
			})
		})
		const data = JSON.stringify(boolData)
		fs.writeFile('./src/data/booldata.json', data, (err) => {
			console.log(err)
		})
		const member = interaction.member as GuildMember
		const embed = new EmbedBuilder()
			.setColor(0x350f4f)
			.setTitle('Sending Bool Invites')
			.setAuthor({ name: member.nickname as string, iconURL: member.user.avatarURL() as string })
			.setDescription(member.nickname + ' Would like to bool on ' + interaction.options._hoistedOptions[0].value)
			.addFields({ name: 'Please check your DMs', value: 'or click a button below' })
			.setTimestamp()
			.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setCustomId('y').setLabel('Yes').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('n').setLabel('No').setStyle(ButtonStyle.Danger),
		)

		await interaction.followUp({ embeds: [embed], components: [row] })
	},
}

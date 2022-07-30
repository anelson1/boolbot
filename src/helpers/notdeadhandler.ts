import { ButtonInteraction, Client, EmbedBuilder, GuildMember, GuildMemberRoleManager, Role, TextChannel, User } from 'discord.js'

export const handleNotDead = (interaction: ButtonInteraction, client: Client) => {
	const notDeadRole = interaction.guild?.roles.cache.get('974090144451809341') as Role
	const memberRoles = interaction.member?.roles as GuildMemberRoleManager
	memberRoles.add(notDeadRole)
	const member = interaction.member as GuildMember
	const user = interaction.user as User
	console.log(member)
	const embed = new EmbedBuilder()
		.setTitle('Not Dead')
		.setAuthor({ name: member.nickname as string, iconURL: user.avatarURL() as string })
		.setThumbnail(user.avatarURL())
		.setDescription(`${member.nickname} is not dead!`)
		.setColor(0x00ff00)
		.setTimestamp()
		.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
	interaction.reply({ ephemeral: true, embeds: [embed] })
	const general = client.channels.cache.get('423937254046826498') as TextChannel
	if (interaction.channelId !== general.id) {
		general.send({ embeds: [embed] })
	}
}

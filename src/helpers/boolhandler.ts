import { ButtonInteraction, Client, EmbedBuilder, TextChannel } from 'discord.js'
import fs from 'fs'
type BoolResponse = {
	id: string
	RSVP: string
	name: string
}

export type BoolData = {
	date: string
	boolers: Array<BoolResponse>
}

export const handleBoolResponse = async (interaction: ButtonInteraction, client: Client) => {
	const user = interaction.user
	const newBooler: BoolResponse = { id: interaction.user.id, RSVP: '', name: '' }
	const embed = new EmbedBuilder()
		.setTitle('Bool RSVP')
		.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
		.setThumbnail(user.avatarURL())
		.setTimestamp()
		.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
	if (interaction.customId === 'y') {
		newBooler.RSVP = 'Y'
		embed.setDescription(user.username + ' has agreed to bool!')
		embed.setColor(0x00ff00)
	} else {
		newBooler.RSVP = 'N'
		embed.setDescription(user.username + ' has turned down the offer to bool!')
		embed.setColor(0xff0000)
	}
	interaction.reply({ embeds: [embed] })
	const general = client.channels.cache.get('423937254046826498') as TextChannel
	if (interaction.channelId !== general.id) {
		general.send({ embeds: [embed] })
	}
	fs.readFile('./src/data/booldata.json', 'utf8', (err, content) => {
		const boolFile = JSON.parse(content) as BoolData
		let alreadyIn = false
		boolFile.boolers.forEach((booler) => {
			if (booler.id === newBooler.id) {
				booler.RSVP = newBooler.RSVP
				alreadyIn = true
			}
		})
		if (!alreadyIn) {
			newBooler.name = user.username
			boolFile.boolers.push(newBooler)
		}
		const boolers = JSON.stringify(boolFile)
		fs.writeFile('./src/data/booldata.json', boolers, (err) => {
			if (err) {
				console.log(err)
			}
		})
	})
}

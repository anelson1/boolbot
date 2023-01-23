import { Client, EmbedBuilder, SelectMenuInteraction, TextChannel } from 'discord.js'
import fs from 'fs'
import { GameData, GameResponse } from 'src/commands/gamer-schedule'

export const handleScheduleResponse = async (interaction: SelectMenuInteraction, client: Client) => {
	const user = interaction.user
	const newEntry: GameResponse = { id: interaction.user.id, name: '', days: interaction.values }
	fs.readFile('./src/data/gamedata.json', 'utf8', (err, content) => {
		const gameFile = JSON.parse(content) as GameData
		const gameName = gameFile.game
		let alreadyIn = false
		gameFile.gamers.forEach((gamer) => {
			if (gamer.id === newEntry.id) {
				gamer.days = newEntry.days
				alreadyIn = true
			}
		})
		if (!alreadyIn) {
			newEntry.name = user.username
			gameFile.gamers.push(newEntry)
		}
		const gamers = JSON.stringify(gameFile)
		fs.writeFile('./src/data/gamedata.json', gamers, (err) => {
			if (err) {
				console.log(err)
			}
		})
		const embed = new EmbedBuilder()
		.setTitle(`${gameName} RSVP`)
		.setColor(0x6b9fcb)
		.setAuthor({ name: user.username, iconURL: user.avatarURL() as string })
		.setThumbnail(user.avatarURL())
		.setTimestamp()
		.setFooter({ text: 'Nelson Net | 2023', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
		.setDescription(`${user.username} can play ${gameName} this week on ${newEntry.days.join().replaceAll(',', ', ')}`)
	interaction.reply({ embeds: [embed] })
	const general = client.channels.cache.get('423937254046826498') as TextChannel
	if (interaction.channelId !== general.id) {
		general.send({ embeds: [embed] })
	}
	})
	
}

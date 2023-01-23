import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, APIEmbedField, SelectMenuBuilder } from 'discord.js'
import { ChatCommand } from '../command'
import fs from 'fs'
import { GameData, GameResponse } from './gamer-schedule'

const calculateIntersect = (gamers: GameResponse[]) => {
	const arr: string[][] = []
	gamers.forEach(gamer => {
		arr.push(gamer.days)
	})
		return arr.reduce((a, c) => a.filter(i => c.includes(i))).join().replaceAll(',', ', ')
}
export const ListCurrentGame: ChatCommand = {
	name: 'listcurrentgame',
	description: 'Lists everyone who was asked to game this week',
	run: async (client: Client, interaction) => {
		fs.readFile('./src/data/gamedata.json', 'utf8', async (err, content) => {
			const gameData = JSON.parse(content) as GameData
			const game = gameData.game
			const gamers = gameData.gamers
			const embed = new EmbedBuilder()
				.setColor(0x6b9fcb)
				.setTitle('Game List')
				.setDescription(`The people who were asked to play ${game} this week`)
				.setTimestamp()
				.setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://www.dropbox.com/s/bz14u4wvt6r0bxf/c46db7762bcc683e809090864ef46177.png?raw=1' })
				let missingValue = false
			gamers.forEach((gamer) => {
				if(gamer.days.length > 0){
					embed.addFields({ name: `${gamer.name} can game on:`, value: gamer.days.join().replaceAll(',', ', ') })
				}
				else {
					missingValue = true
					embed.addFields({ name: `${gamer.name} has not selected days yet:`, value: 'Please use the box below to select your days' })
				}
			})
			if(!missingValue){
				embed.addFields({ name: 'The best day(s) for everyone are:', value: calculateIntersect(gamers) })
			}
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
			await interaction.followUp({ embeds: [embed], components: [row] })
		})
	},
}

import { SlashCommandBuilder } from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('pong'),
	async execute(interaction: { reply: (arg0: string) => any }) {
		await interaction.reply('pong')
	},
}
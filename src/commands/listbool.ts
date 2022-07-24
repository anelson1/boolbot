import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from 'discord.js'
import { ChatCommand } from '../command'
import { BoolData } from '../helpers/boolhandler'
import fs from 'fs'

export const ListBool: ChatCommand = {
  name: 'listbool',
  description: 'Lists everyone who was asked to bool and their responses',
  run: async (client: Client, interaction: any) => {
    fs.readFile('./src/data/booldata.json', 'utf8', async (err, content) => {
      const boolData = JSON.parse(content) as BoolData
      const date = boolData.date
      const boolers = boolData.boolers

      const embed = new EmbedBuilder()
        .setColor(0xff9733)
        .setTitle('Bool List')
        .setDescription('The list of people who were asked to bool on ' + date)
        .setTimestamp()
        .setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
      boolers.forEach((booler) => {
        let fieldText = ''
        if (booler.RSVP === 'NA') {
          fieldText = ':grey_question: - ' + booler.name
        } else if (booler.RSVP === 'Y') {
          fieldText = ':white_check_mark: - ' + booler.name
        } else if (booler.RSVP === 'N') {
          fieldText = ':x: - ' + booler.name
        }
        embed.addFields({ name: fieldText, value: '---------------------------------' })
      })
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('y').setLabel('Yes').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('n').setLabel('No').setStyle(ButtonStyle.Danger),
      )
      await interaction.followUp({ embeds: [embed], components: [row] })
    })
  },
}

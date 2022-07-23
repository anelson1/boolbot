import { ButtonInteraction, Client, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'
import fs from 'fs'
type BoolResponse = {
  id: string
  RSVP: string
}

export const handleBoolResponse = async (interaction: ButtonInteraction, client: Client) => {
  const user = interaction.user
  let newBooler: any = { id: interaction.user.id }
  const embed = new EmbedBuilder()
    .setTitle('Bool RSVP')
    .setAuthor({ name: user.username, iconURL: user.avatarURL()! })
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
  general.send({ embeds: [embed] })
  const boolData = {
    boolers: [newBooler],
  }
  fs.readFile('./src/data/booldata.json', 'utf8', (err, content) => {
    if (err?.errno === -2) {
      const data = JSON.stringify(boolData)
      fs.writeFile('./src/data/booldata.json', data, { flag: 'wx' }, (err) => {})
      return
    }
    const boolFile = JSON.parse(content) as { boolers: Array<BoolResponse> }
    boolFile.boolers.forEach((booler, i) => {
      if (booler.id === newBooler.id) {
        boolFile.boolers.splice(i, 1)
      }
    })

    boolFile.boolers.push(newBooler)
    const boolers = JSON.stringify(boolFile)
    fs.writeFile('./src/data/booldata.json', boolers, (err) => {})
  })
}

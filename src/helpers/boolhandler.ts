import { ButtonInteraction, GuildMember } from 'discord.js'
import fs from 'fs'
type BoolResponse = {
  id: number
  name: string
  RSVP: boolean
}
export const handleBoolResponse = (interaction: ButtonInteraction) => {
  const member = interaction.member as GuildMember
  if (interaction.customId === 'y') {
    const boolEntry = {
      id: interaction.user.id,
      name: member?.nickname,
      RSVP: true,
    }
    let data = JSON.stringify(boolEntry)
    fs.writeFileSync('./data/booldata.json', data, { flag: 'wx' })
  }
}

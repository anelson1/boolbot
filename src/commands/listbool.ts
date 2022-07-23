import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from 'discord.js'
import { ChatCommand } from '../command'

export const Bool: ChatCommand = {
  name: 'listbool',
  description: 'Lists everyone who was asked to bool and their responses',
  run: async (client: Client, interaction: any) => {
    console.log(interaction)
    const guild = client.guilds.cache.get('423937254046826496')
    guild?.roles.cache.get('760375992513724426')?.members.forEach((member) => {
      member.createDM().then((dm) => {
        const embed = new EmbedBuilder()
          .setColor(0x350f4f)
          .setTitle('Bool Invite')
          .setAuthor({ name: member.nickname!, iconURL: member.user.avatarURL()! })
          .setDescription(member.nickname + ' Would like to bool on ' + interaction.options._hoistedOptions[0].value)
          .setTimestamp()
          .setFooter({ text: 'Nelson Net | 2022', iconURL: 'https://i.pinimg.com/originals/8f/a0/27/8fa027d12ec18ac6fcb4567523f64fe3.jpg' })
        dm.send({ embeds: [embed], components: [row] })
      })
    })
    const member = interaction.member as GuildMember
    console.log(member.user.avatar, member.user.avatarURL())
    const embed = new EmbedBuilder()
      .setColor(0x350f4f)
      .setTitle('Sending Bool Invites')
      .setAuthor({ name: member.nickname!, iconURL: member.user.avatarURL()! })
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

import { Client, Collection, GatewayIntentBits, Interaction } from 'discord.js'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command)
}
client.once('ready', () => {
  console.log('Boolbot Starting Up')
})

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) {
    return
  }
  const { commandName } = interaction

  if (commandName === 'ping') {
    await interaction.reply('bruh')
  }
})

client.login(process.env.boolbottoken)

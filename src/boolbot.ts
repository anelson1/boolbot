import { Client, Collection, GatewayIntentBits, Interaction } from 'discord.js'
import * as dotenv from 'dotenv'
import ready from './listiners/ready'
import interactionCreate from './listiners/interactionCreate'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

ready(client)
interactionCreate(client)

client.login(process.env.boolbottoken)

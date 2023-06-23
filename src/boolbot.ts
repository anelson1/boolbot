import { Client, GatewayIntentBits } from 'discord.js'
import * as dotenv from 'dotenv'
import ready from './listener/ready'
import interactionCreate from './listener/interactionCreate'

dotenv.config()

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})

ready(client)
interactionCreate(client)

client.login(process.env.boolbottoken).then(() => console.log('We are logged in'))

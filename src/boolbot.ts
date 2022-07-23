import { Client, Interaction } from "discord.js"
import * as dotenv from 'dotenv'

dotenv.config()

const client = new Client({
    intents: []
});

client.once('ready', () => {
    console.log("Boolbot starting up")
})

client.on('interactionCreate', async (interaction:Interaction) => {
    if(!interaction.isChatInputCommand()){
        return
    }
    const { commandName } = interaction

    if(commandName === "ping"){
        await interaction.reply('bruh')
    }
})

client.login(process.env.boolbottoken)
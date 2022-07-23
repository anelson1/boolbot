import { SlashCommandBuilder, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import * as dotenv from 'dotenv'
import { applicationId, guildId } from './config.json'
dotenv.config()

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('pong'),
	new SlashCommandBuilder().setName('bool').setDescription('Send a bool invite out to every member of the boolin role'),
	new SlashCommandBuilder().setName('listbool').setDescription('List everyone who agreed to bool'),

].map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken(String(process.env.boolbottoken))

rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands })
	.then(() => console.log('Commands Registered'))
	.catch(console.error)

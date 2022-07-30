import { ActivityType, Client } from 'discord.js'
import { Commands } from '../commands'

export default (client: Client): void => {
	client.on('ready', async () => {
		if (!client.user || !client.application) {
			return
		}
		await client.application.commands.set(Commands)
		client.user.setActivity('over our bools', { type: ActivityType.Watching })
		console.log(`${client.user.username} is ready to bool`)
	})
}

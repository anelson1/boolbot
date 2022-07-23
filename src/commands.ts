import { ChatCommand } from './command'
import { Hello } from './commands/hello'
import { Bool } from './commands/bool'

export const Commands: ChatCommand[] = [Hello, Bool]

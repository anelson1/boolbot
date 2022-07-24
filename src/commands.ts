import { ChatCommand } from './command'
import { Bool } from './commands/bool'
import { ListBool } from './commands/listbool'

export const Commands: ChatCommand[] = [Bool, ListBool]

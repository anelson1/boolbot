import { ChatCommand } from './command'
import { Bool } from './commands/bool'
import { ListBool } from './commands/listbool'
import { NotDead } from './commands/notdead'

export const Commands: ChatCommand[] = [Bool, ListBool]

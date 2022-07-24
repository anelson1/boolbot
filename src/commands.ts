import { ChatCommand } from './command'
import { Hello } from './commands/hello'
import { Bool } from './commands/bool'
import { ListBool } from './commands/listbool'

export const Commands: ChatCommand[] = [Hello, Bool, ListBool]

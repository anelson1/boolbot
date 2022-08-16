import { ChatCommand } from './command'
import { Bool } from './commands/bool'
import { ListBool } from './commands/listbool'
import { TotalEquity } from './commands/totalequity'
export const Commands: ChatCommand[] = [Bool, ListBool, TotalEquity]

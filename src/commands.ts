import { ChatCommand } from './command'
import { Bool } from './commands/bool'
import { GameRSVP } from './commands/gamer-schedule'
import { ListCurrentGame } from './commands/list-current-game'
import { ListBool } from './commands/listbool'
import { TotalEquity } from './commands/totalequity'
export const Commands: ChatCommand[] = [Bool, ListBool, TotalEquity, GameRSVP, ListCurrentGame]

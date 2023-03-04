import { ChatCommand } from './command'
import { Bool } from './commands/bool'
import { GameRSVP } from './commands/gamerSchedule'
import { ListCurrentGame } from './commands/listCurrentGame'
import { ListBoolDays } from './commands/listBoolDays'
import { TotalEquity } from './commands/totalequity'
import { ListBool } from './commands/listBool'
export const Commands: ChatCommand[] = [Bool, ListBoolDays, TotalEquity, GameRSVP, ListCurrentGame, ListBool]

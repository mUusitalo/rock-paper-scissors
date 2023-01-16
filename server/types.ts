import { Round } from './Round'
import { Move, Result } from './gameLogic'

export type Match = {
  roundCount: number
  roundCutoff: number
  rounds: Array<Round>
  result?: MatchResult
}

export type MatchResult = {
  winner: Result
  reason: 'rounds' | 'roundCutoff'
}

export type TimedMove = { move: Move; timeTakenMs: number }

export type RoundResult = {
  winner: Result
  reason: 'move' | 'time'
}



import { Socket } from 'socket.io'
import { Round } from './logic/Round'
import { Move, Result } from './logic/gameLogic'

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

export type RoundReason = 'move' | 'time'

export type RoundResult = {
  winner: Result
  reason: RoundReason
}

export type PersonalizedResult = {
  you?: Move
  opponent?: Move
  result: 'win' | 'loss' | 'draw'
}

export type Matchup = {
  left?: { name: string; socket: Socket }
  right?: { name: string; socket: Socket }
}

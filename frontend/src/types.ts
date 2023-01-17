export const Moves = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
} as const

export type Move = keyof typeof Moves

export type Side = 'LEFT' | 'RIGHT'

export type Result = Side | 'DRAW'

export type Round = {
  left?: Move
  right?: Move
  winner: Result
  reason: 'move' | 'time'
}

export type Bots = { left?: string; right?: string }

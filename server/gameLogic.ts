const Moves = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
} as const

export type Move = keyof typeof Moves

export type Side = "LEFT" | "RIGHT"

export type Result = Side | "DRAW"

export function runGame(leftChoice: Move, rightChoice: Move): Result {
  const length = Object.keys(Moves).length
  const result = (length + Moves[leftChoice] - Moves[rightChoice]) % length
  switch(result) {
    case 0:
      return "DRAW"
    case 1:
      return "LEFT"
    case 2:
      return "RIGHT"
    default:
      throw new Error("Invalid result")
  }
}
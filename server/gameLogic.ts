// These indices are used for calculating the result of the game
export const Moves = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
} as const

export type Move = keyof typeof Moves

export type Side = "LEFT" | "RIGHT"

export type Result = Side | "DRAW"

/**
 * Runs a game of rock-paper-scissors.
 * @param leftChoice Move of left player
 * @param rightChoice Move of right player
 * @returns The winner ("LEFT" or "RIGHT") or "DRAW" if both players made the same move
 */
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
      // This should never be reached but a type-safe implementation would lead to repetitive code
      throw new Error("Invalid result")
  }
}
import { Round } from "./Round";
import { Move } from "./gameLogic";
import { MatchResult, RoundResult } from "./types";

class Match {
  rounds: RoundResult[] = []
  result: Promise<MatchResult>
  roundCount: number
  roundTimeoutMs: number
  private resolveResult?: (result: MatchResult) => void
  
  constructor(roundCount: number, roundTimeoutMs: number) {
    this.roundCount = roundCount
    this.roundTimeoutMs = roundTimeoutMs
    this.result = new Promise(resolve => {
      this.resolveResult = resolve
    })
  }

  async run(getLeftMove: () => Promise<Move>, getRightMove: () => Promise<Move>): Promise<void> {
    for (let i = 0; i < this.roundCount; i++) {
      console.log("Round: ", i)
      const round = new Round(this.roundTimeoutMs)
      round.makeMoveAsync(getLeftMove(), 'LEFT')
      round.makeMoveAsync(getRightMove(), 'RIGHT')
      const roundResult = await round.result
      this.rounds.push(roundResult)
    }
    
    this.resolveResult!(this.calculateMatchResult())
  }

  private calculateMatchResult(): MatchResult {
    const roundsPlayed = this.rounds.length

    if (roundsPlayed != this.roundCount) {
      throw new Error(`Not all rounds have been played (${roundsPlayed} rounds played, ${this.roundCount} rounds expected)`)
    }
    
    const left = this.rounds.filter(round => round.winner === 'LEFT').length
    const right = this.rounds.filter(round => round.winner === 'RIGHT').length

    const winner = left > right ? 'LEFT' : right > left ? 'RIGHT' : 'DRAW'
    return { winner, reason: 'rounds' }
  }
}

export default Match
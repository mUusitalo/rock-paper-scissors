import { Round } from './Round'
import { Move, Side } from './gameLogic'
import { MatchResult, PersonalizedResult, RoundResult } from './types'

type getNewMove = (previousRound?: PersonalizedResult) => Promise<Move>

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

  async run(getLeftMove: getNewMove, getRightMove: getNewMove): Promise<void> {
    let previousRound: Round | null = null

    for (let i = 0; i < this.roundCount; i++) {
      console.log('Round: ', i)
      const round = new Round(this.roundTimeoutMs)
      const [leftResult, rightResult] = await Promise.all([
        previousRound?.getPersonalizedResult('LEFT'),
        previousRound?.getPersonalizedResult('RIGHT')
      ])
      round.makeMoveAsync(
        getLeftMove(leftResult),
        'LEFT'
      )
      round.makeMoveAsync(
        getRightMove(rightResult),
        'RIGHT'
      )
      const roundResult = await round.result
      this.rounds.push(roundResult)
      previousRound = round
    }

    this.resolveResult!(this.calculateMatchResult())
  }

  private calculateMatchResult(): MatchResult {
    const roundsPlayed = this.rounds.length

    if (roundsPlayed != this.roundCount) {
      throw new Error(
        `Not all rounds have been played (${roundsPlayed} rounds played, ${this.roundCount} rounds expected)`
      )
    }

    const left = this.rounds.filter((round) => round.winner === 'LEFT').length
    const right = this.rounds.filter((round) => round.winner === 'RIGHT').length

    const winner = left > right ? 'LEFT' : right > left ? 'RIGHT' : 'DRAW'
    return { winner, reason: 'rounds' }
  }
}

export default Match

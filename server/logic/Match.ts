import { Round } from './Round'
import { Move, Side } from './gameLogic'
import { MatchResult, PersonalizedResult, RoundResult } from '../types'

type getNewMove = (previousRound?: PersonalizedResult) => Promise<Move>

class Match {
  rounds: Round[] = []
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

  async run(getLeftMove: getNewMove, getRightMove: getNewMove, onResult: ((result: RoundResult) => void)): Promise<void> {
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
      onResult(roundResult)
      this.rounds.push(round)
      previousRound = round
    }

    this.resolveResult!(await this.calculateMatchResult())
  }

  private async calculateMatchResult(): Promise<MatchResult> {
    const roundsPlayed = this.rounds.length

    if (roundsPlayed != this.roundCount) {
      throw new Error(
        `Not all rounds have been played (${roundsPlayed} rounds played, ${this.roundCount} rounds expected)`
      )
    }

    const results = (await Promise.all(this.rounds.map(round => round.result))).map(result => result.winner)
    
    const left = results.filter(res => res === 'LEFT').length
    const right = results.filter(res => res === 'RIGHT').length
    
    const winner = left > right ? 'LEFT' : right > left ? 'RIGHT' : 'DRAW'
    return { winner, reason: 'rounds' }
  }
}

export default Match

import { Move, Side, runGame } from './gameLogic'
import { TimedMove, RoundResult, PersonalizedResult } from '../types'

export class Round {
  timeoutMs: number
  result: Promise<RoundResult>
  left?: TimedMove
  right?: TimedMove
  private startTime: number
  private timeoutId?: NodeJS.Timeout
  private resolveResult?: (result: RoundResult) => void

  constructor(timeout: number) {
    if (timeout < 0) {
      throw new Error('Timeout cannot be negative')
    }
    this.timeoutMs = timeout
    // Game is started immediately
    this.startTime = Date.now()

    // Set up timeout of the game, grab resolve function from promise for outside use
    this.result = new Promise(resolve => {
      this.timeoutId = setTimeout(
        () => resolve(this.getTimeoutResult()),
        timeout
      )
      this.resolveResult = resolve
    })
  }

  async getPersonalizedResult(side: Side): Promise<PersonalizedResult> {
    const result = await this.result
    const you = this.getMove(side)?.move
    const opponent = this.getMove(side === 'LEFT' ? 'RIGHT' : 'LEFT')?.move
    const personalizedResult = result.winner === side ? 'win' : result.winner === 'DRAW' ? 'draw' : 'loss'
    return { you, opponent, result: personalizedResult }
  }

  /**
   * Helper function for getting this.left or this.right
   * @param side Side to get the move for
   * @returns the move for the given side. 
   */
  getMove(side: Side): TimedMove | undefined {
    return side === 'LEFT' ? this.left : this.right
  }

  /**
   * Makes a move for one player.
   * Checks if both players have made their moves and resolves the result of the game if so.
   * @param move Move to be made
   * @param side Side to make the move on
   */
  makeMove(move: Move, side: Side): void {
    if (this.getMove(side)) {
      throw new Error(`Move already added for ${side}`)
    }
    const timeTakenMs = Date.now() - this.startTime
    const timedMove = { move, timeTakenMs }
    side === 'LEFT' ? (this.left = timedMove) : (this.right = timedMove)
    if (this.left && this.right) {
      this.handleBothMovesMade()
    }
  }

  async makeMoveAsync(move: Promise<Move>, side: Side): Promise<void> {
    this.makeMove(await move, side)
  }
  
  /**
   * Clears the timeout and resolves the promise with the result based on the moves.
   */
  private handleBothMovesMade(): void {
    clearTimeout(this.timeoutId)
    this.resolveResult!(this.getMoveResult())
  }

  /**
   * Gets result when timeout has been reached. Throws error if both moves have been made.
   */
  private getTimeoutResult(): RoundResult {
    if (this.left && this.right) {
      throw Error('Both moves have been made')
    }

    const reason = 'time'

    if (!(this.left || this.right)) {
      return { winner: 'DRAW', reason }
    }

    return {
      winner: this.left ? 'LEFT' : 'RIGHT',
      reason,
    }
  }

  /**
   * Gets result when both moves have been made. Throws error if either of the moves has not been made.
   */
  private getMoveResult(): RoundResult {
    if (!this.left || !this.right) {
      throw Error('Both moves have to be made')
    }
    const { left, right } = this
    const { move: leftMove, timeTakenMs: leftTime } = left
    const { move: rightMove, timeTakenMs: rightTime } = right

    return { winner: runGame(leftMove, rightMove), reason: 'move' }
  }
}

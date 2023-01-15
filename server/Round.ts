import { Move, Side, runGame } from './gameLogic'
import { TimedMove, RoundResult } from './types'

export class Round {
  timeout: number
  left?: TimedMove
  right?: TimedMove
  private _result?: RoundResult
  private startTime: number
  private timeoutId: NodeJS.Timeout

  constructor(timeout: number) {
    this.timeout = timeout
    this.startTime = Date.now()
    this.timeoutId = setTimeout(this.handleTimeout.bind(this), timeout)
  }

  getMove(side: Side) {
    return side === 'LEFT' ? this.left : this.right
  }

  private cancelTimeoutIfBothMovesHaveBeenMade() {
    if (this.left && this.right) clearTimeout(this.timeoutId)
  }

  addMove(move: Move, side: Side) {
    if (this.getMove(side)) {
      throw new Error(`Move already added for ${side}`)
    }
    const timeTakenMs = Date.now() - this.startTime
    const TimedMove = { move, timeTakenMs }
    side === 'LEFT' ? (this.left = TimedMove) : (this.right = TimedMove)
    this.cancelTimeoutIfBothMovesHaveBeenMade()
  }

  private handleTimeout() {
    if (this.left && this.right) return

    const reason = 'time'

    if (!(this.left || this.right)) {
      this._result = { winner: 'DRAW', reason }
      return
    }

    this._result = {
      winner: this.left ? 'LEFT' : 'RIGHT',
      reason,
    }
  }

  get result(): RoundResult | null {
    if (this._result) {
      return this._result
    }
    if (!this.left || !this.right) {
      return null
    }
    const { left, right } = this
    const { move: leftMove, timeTakenMs: leftTime } = left
    const { move: rightMove, timeTakenMs: rightTime } = right

    this._result = { winner: runGame(leftMove, rightMove), reason: 'move' }

    return this._result
  }
}

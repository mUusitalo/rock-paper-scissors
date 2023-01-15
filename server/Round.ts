import { Move, Side, runGame } from './gameLogic'
import { TimedMove, RoundResult } from './types'

export class Round {
  timeout: number
  left?: TimedMove
  right?: TimedMove
  _result?: RoundResult
  _startTime: number

  constructor(timeout: number) {
    this.timeout = timeout
    this._startTime = Date.now()
  }

  getMove(side: Side) {
    return side === 'LEFT' ? this.left : this.right
  }

  addMove(move: Move, side: Side) {
    if (this.getMove(side)) {
      throw new Error(`Move already added for ${side}`)
    }
    const timeTakenMs = Date.now() - this._startTime
    const TimedMove = { move, timeTakenMs }
    side === 'LEFT' ? (this.left = TimedMove) : (this.right = TimedMove)
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

    if (leftTime > this.timeout && rightTime > this.timeout) {
      this._result = { winner: 'DRAW', reason: 'time' }
    } else if (leftTime > this.timeout) {
      this._result = { winner: 'RIGHT', reason: 'time' }
    } else if (rightTime > this.timeout) {
      this._result = { winner: 'LEFT', reason: 'time' }
    } else {
      this._result = { winner: runGame(leftMove, rightMove), reason: 'move' }
    }

    return this._result
  }
}

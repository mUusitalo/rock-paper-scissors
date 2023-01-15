import { Round } from './Round'

describe('Round', () => {
  it('should be defined', () => {
    expect(Round).toBeDefined()
  })

  describe("When not finished", () => {
    it('when no moves have been made', () => {
      const round = new Round(1000)
      const result = round.result
      expect(result).toBeNull()
    })

    it('when only one left has made a move', () => {
      const round = new Round(1000)
      round.addMove('ROCK', 'LEFT')
      const result = round.result
      expect(result).toBeNull()
    })

    it('when only right has made a move', () => {
      const round = new Round(1000)
      round.addMove('ROCK', 'RIGHT')
      const result = round.result
      expect(result).toBeNull()
    })
  })
  
  describe('Move-based results', () => {
    it("Left should win with reason 'move' when played within time constraint", () => {
      const round = new Round(1000)
      round.addMove('PAPER', 'LEFT')
      round.addMove('ROCK', 'RIGHT')
      const result = round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('LEFT')
      expect(reason).toBe('move')
    })

    it("Right should win with reason 'move' when played within time constraint", () => {
      const round = new Round(1000)
      round.addMove('PAPER', 'LEFT')
      round.addMove('SCISSORS', 'RIGHT')
      const result = round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('RIGHT')
      expect(reason).toBe('move')
    })
  })

  describe('Time-based results', () => {
    var round: Round

    beforeAll(() => {
      jest.useFakeTimers()
    })
    
    afterAll(() => {
      jest.useRealTimers()
    })

    beforeEach(() => {
      round = new Round(1000)
    })

    it("Left should win with reason 'time' when right is too slow", () => {
      round.addMove('PAPER', 'LEFT')
      jest.advanceTimersByTime(1001)
      const result = round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('LEFT')
      expect(reason).toBe('time')
    })

    it("Right should win with reason 'time' when left is too slow", () => {
      round.addMove('ROCK', 'RIGHT')
      jest.advanceTimersByTime(1001)
      const result = round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('RIGHT')
      expect(reason).toBe('time')
    })

    it("Should end in a draw with reason 'time' when both players are too slow", () => {
      jest.advanceTimersByTime(1001)
      const result = round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('DRAW')
      expect(reason).toBe('time')
    })
  })
})

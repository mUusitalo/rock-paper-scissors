import { Round } from './Round'

describe('Round', () => {
  it('should be defined', () => {
    expect(Round).toBeDefined()
  })
  
  describe('Move-based results', () => {
    it("Left should win with reason 'move' when played within time constraint", async () => {
      const round = new Round(1000)
      round.makeMove('PAPER', 'LEFT')
      round.makeMove('ROCK', 'RIGHT')
      const result = await round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('LEFT')
      expect(reason).toBe('move')
    })

    it("Right should win with reason 'move' when played within time constraint", async () => {
      const round = new Round(1000)
      round.makeMove('PAPER', 'LEFT')
      round.makeMove('SCISSORS', 'RIGHT')
      const result = await round.result
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

    it("Left should win with reason 'time' when right is too slow", async () => {
      round.makeMove('PAPER', 'LEFT')
      jest.advanceTimersByTime(1001)
      const result = await round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('LEFT')
      expect(reason).toBe('time')
    })

    it("Right should win with reason 'time' when left is too slow", async () => {
      round.makeMove('ROCK', 'RIGHT')
      jest.advanceTimersByTime(1001)
      const result = await round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('RIGHT')
      expect(reason).toBe('time')
    })

    it("Should end in a draw with reason 'time' when both players are too slow", async () => {
      jest.advanceTimersByTime(1001)
      const result = await round.result
      expect(result).toBeDefined()
      const { winner, reason } = result ?? {}
      expect(winner).toBeDefined()
      expect(reason).toBeDefined()
      expect(winner).toBe('DRAW')
      expect(reason).toBe('time')
    })
  })
})

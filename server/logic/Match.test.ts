import Match from './Match';
import { Move, Moves } from './gameLogic';

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

async function getRandomMove(delayMs: number): Promise<Move> {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  // Randomly choose a move from the list of possible moves
  const moves = Object.keys(Moves)
  return moves[Math.floor(Math.random() * moves.length)] as Move;
}

describe('Match', () => {
  it("Should return a winner when the game is over", async () => {
    const match = new Match(100, 50)
    match.run(() => getRandomMove(0), () => getRandomMove(0));
    expect(await match.result).not.toBe(null);
  });

  describe("Should return correct winner", () => {
    describe("Timeouts", () => {
      it("Should return LEFT when LEFT wins", async () => {
        const match = new Match(3, 3)
        match.run(() => getRandomMove(1), () => getRandomMove(5));
        expect((await match.result).winner).toBe('LEFT');
      });

      it("Should return RIGHT when RIGHT wins", async () => {
        const match = new Match(3, 3)
        match.run(() => getRandomMove(5), () => getRandomMove(1));
        expect((await match.result).winner).toBe('RIGHT');
      });
      
      it("Should return DRAW when both players draw", async () => {
        const match = new Match(3, 3)
        match.run(() => getRandomMove(5), () => getRandomMove(5));
        expect((await match.result).winner).toBe('DRAW');
      });
    });

    describe("Moves", () => {
      it("Should return LEFT when LEFT wins", async () => {
        const match = new Match(100, 50)
        match.run(async () => 'ROCK', async () => 'SCISSORS');
        jest.advanceTimersByTime(51)
        expect((await match.result).winner).toBe('LEFT');
      });

      it("Should return RIGHT when RIGHT wins", async () => {
        const match = new Match(100, 50)
        match.run(async () => 'SCISSORS', async () => 'ROCK');
        jest.advanceTimersByTime(51)
        expect((await match.result).winner).toBe('RIGHT');
      });
      
      it("Should return DRAW when both players draw", async () => {
        const match = new Match(100, 50)
        match.run(async () => 'ROCK', async () => 'ROCK');
        jest.advanceTimersByTime(51)
        expect((await match.result).winner).toBe('DRAW');
      });
    });
  });

  describe("Should call getNewMove with the correct values", () => {
    it("No value when it's the first round", async () => {
      const match = new Match(3, 3)
      const getLeftMove = jest.fn(() => getRandomMove(0));
      const getRightMove = jest.fn(() => getRandomMove(0));
      match.run(getLeftMove, getRightMove);
      await flushPromises();
      expect(getLeftMove).toBeCalledWith(undefined);
      expect(getRightMove).toBeCalledWith(undefined);
    });

    it("Previous round's result when it's not the first round", async () => {
      const match = new Match(3, 3)
      let leftIndex = 0;
      let rightIndex = 0;
      const leftMoves: Move[] = ["ROCK", "SCISSORS", "PAPER"];
      const rightMoves: Move[] = ["SCISSORS", "SCISSORS", "ROCK"];
      const getLeftMove = jest.fn(async () => {
        leftIndex++
        return leftMoves[leftIndex - 1]
      });
      const getRightMove = jest.fn(async () => {
        rightIndex++
        return rightMoves[rightIndex - 1]
      });
      match.run(getLeftMove, getRightMove);
      await flushPromises();
      expect(getLeftMove).toBeCalledWith(undefined);
      expect(getRightMove).toBeCalledWith(undefined);
      await flushPromises();
      expect(getLeftMove).toBeCalledWith({ you: "ROCK", opponent: "SCISSORS", result: "win" });
      expect(getRightMove).toBeCalledWith({ you: "SCISSORS", opponent: "ROCK", result: "loss" });
      await flushPromises();
      expect(getLeftMove).toBeCalledWith({ you: "SCISSORS", opponent: "SCISSORS", result: "draw" });
      expect(getRightMove).toBeCalledWith({ you: "SCISSORS", opponent: "SCISSORS", result: "draw" });
    });
  });
});
import Match from './Match';
import { Move, Moves } from './gameLogic';

async function getRandomMove(delayMs: number): Promise<Move> {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  // Randomly choose a move from the list of possible moves
  const moves = Object.keys(Moves)
  return moves[Math.floor(Math.random() * moves.length)] as Move;
}

describe('Match', () => {
  it("Should return a winner when the game is over", async () => {
    const match = new Match(100, 50)
    match.run(() => getRandomMove(5), () => getRandomMove(5));
    expect(await match.result).not.toBe(null);
  });

  describe("Should return correct winner", () => {
    describe("Timeouts", () => {
      it("Should return LEFT when LEFT wins", async () => {
        const match = new Match(5, 50)
        match.run(() => getRandomMove(5), () => getRandomMove(100));
        expect((await match.result).winner).toBe('LEFT');
      });

      it("Should return RIGHT when RIGHT wins", async () => {
        const match = new Match(5, 50)
        match.run(() => getRandomMove(100), () => getRandomMove(5));
        expect((await match.result).winner).toBe('RIGHT');
      });
      
      it("Should return DRAW when both players draw", async () => {
        const match = new Match(5, 50)
        match.run(() => getRandomMove(100), () => getRandomMove(100));
        expect((await match.result).winner).toBe('DRAW');
      });
    });

    describe("Moves", () => {
      it("Should return LEFT when LEFT wins", async () => {
        const match = new Match(100, 50)
        match.run(async () => 'ROCK', async () => 'SCISSORS');
        expect((await match.result).winner).toBe('LEFT');
      });

      it("Should return RIGHT when RIGHT wins", async () => {
        const match = new Match(100, 50)
        match.run(async () => 'SCISSORS', async () => 'ROCK');
        expect((await match.result).winner).toBe('RIGHT');
      });
      
      it("Should return DRAW when both players draw", async () => {
        const match = new Match(100, 50)
        match.run(async () => 'ROCK', async () => 'ROCK');
        expect((await match.result).winner).toBe('DRAW');
      });
    });
  });
});
import { Round } from "./Round";

describe("Round", () => {
  it("should be defined", () => {
    expect(Round).toBeDefined();
  });

  it("should end in result with reason 'move' when played within time constraint", () => {
    const round = new Round(1000);
    round.addMove("ROCK", "LEFT")
    round.addMove("PAPER", "RIGHT")
    const result = round.result
    expect(result).toBeDefined();
    const { winner, reason } = result ?? {}
    expect(winner).toBeDefined();
    expect(reason).toBeDefined();
    expect(winner).toBe("RIGHT");
    expect(reason).toBe("move");
  });

  describe("result should be null when moves haven't been made", () => {
    it("when no moves have been made", () => {
      const round = new Round(1000);
      const result = round.result
      expect(result).toBeNull();
    });

    it("when only one left has made a move", () => {
      const round = new Round(1000);
      round.addMove("ROCK", "LEFT")
      const result = round.result
      expect(result).toBeNull();
    });

    it("when only right has made a move", () => {
      const round = new Round(1000);
      round.addMove("ROCK", "RIGHT")
      const result = round.result
      expect(result).toBeNull();
    });
  })
})
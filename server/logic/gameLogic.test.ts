// Test gameLogic.ts

import { runGame } from "./gameLogic";
import type { Move, Result } from "./gameLogic";

describe("runGame", () => {
  const testCases: Array<[Move, Move, Result]> = [
    ["ROCK", "ROCK", "DRAW"],
    ["ROCK", "PAPER", "RIGHT"],
    ["ROCK", "SCISSORS", "LEFT"],
    ["PAPER", "ROCK", "LEFT"],
    ["PAPER", "PAPER", "DRAW"],
    ["PAPER", "SCISSORS", "RIGHT"],
    ["SCISSORS", "ROCK", "RIGHT"],
    ["SCISSORS", "PAPER", "LEFT"],
    ["SCISSORS", "SCISSORS", "DRAW"],
  ];

  test.each(testCases)(
    "runGame(%s, %s) should return %s",
    (leftChoice: Move, rightChoice: Move, expectedResult: Result) => {
      const result = runGame(leftChoice, rightChoice);
      expect(result).toEqual(expectedResult);
    }
  );
});
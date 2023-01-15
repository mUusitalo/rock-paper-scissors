import { Move, Result } from "./gameLogic";

type Game = {
  roundCount: number;
  rounds: Array<Round>;
  result: GameResult;
}

type GameResult = {
  winner: Result;
  reason: "rounds" | "time" | "draw";
}

type TimedMove = Move & { timeTakenMs: number };

type RoundResult = {
  winner: Result;
  reason: "move" | "time";
}

type Round = {
  timeout: number;
  left: TimedMove;
  right: TimedMove;
  result: RoundResult;
}

/* class Game {
  constructor() {
    this.roundCount = 0;
    this.rounds = [];
    this.result = null;
  }

  addRound(round: Round) {
    this.rounds.push(round);
    this.roundCount += 1;
  }

  setResult(result: GameResult) {
    this.result = result;
  }
} */
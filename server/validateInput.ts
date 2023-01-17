import { Move, Moves } from "./logic/gameLogic";

export function isMove(input: any): input is Move {
  return typeof input === 'string' && input in Moves
}
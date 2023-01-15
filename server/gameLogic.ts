const RockPaperScissorsEnum = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
}

const Player = {
  LEFT: 0,
  RIGHT: 1,
}

function runGame(leftChoice, rightChoice) {
  const length = Object.keys(RockPaperScissorsEnum).length
  const leftWon = (length + leftChoice - rightChoice) % length === 1
  return leftWon ? Player.LEFT : Player.RIGHT
}

export default {
  RockPaperScissorsEnum,
  Player,
  runGame,
}
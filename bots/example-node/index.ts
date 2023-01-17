import { io } from 'socket.io-client'
import dotenv from 'dotenv'
dotenv.config({path: '../../.env'})

const { HOST, SERVER_PORT } = process.env
const SERVER_URL = `http://${HOST}:${SERVER_PORT}`

export const Moves = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
} as const

export type Move = keyof typeof Moves

type RoundResult = {
  you?: Move,
  opponent?: Move,
  result: 'win' | 'loss' | 'draw'
}

function main() {
  const socket = io(SERVER_URL)
  
  let roundIndex = 0

  socket.on('round', (previousRound: RoundResult | undefined) => {
    console.log(previousRound)
    const possibleMoves = Object.keys(Moves) as Move[]
    const move = possibleMoves[roundIndex % possibleMoves.length]
    socket.emit('move', move)
    roundIndex++
  })
}

main()
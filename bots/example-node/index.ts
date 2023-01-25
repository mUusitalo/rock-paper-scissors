import { io } from 'socket.io-client'
import dotenv from 'dotenv'

const SERVER_URL = 'http://localhost:3001'

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
  console.log("Trying to connect to server")
  const socket = io(SERVER_URL, { autoConnect: true })
  socket.connect()
  
  let roundIndex = 0

  socket.on('connect', () => {
    console.log("Connected to server")
    socket.emit('bot', 'example-node')
  })

  socket.on('round', (previousRound: RoundResult | undefined) => {
    console.log(previousRound)
    const possibleMoves = Object.keys(Moves) as Move[]
    const move = possibleMoves[roundIndex % possibleMoves.length]
    socket.emit('move', move)
    roundIndex++
  })
}

main()
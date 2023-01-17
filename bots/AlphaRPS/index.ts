import { io } from 'socket.io-client'
import dotenv from 'dotenv'


const SERVER_URL = 'http://server:3001'

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

console.log("Trying to connect to server")
const socket = io(SERVER_URL)
socket.connect()

let roundIndex = 0

socket.on('connect', () => {
  console.log("Connected to server")
  socket.emit('bot', 'AlphaRPS')
})

const previousRounds: RoundResult[] = []

socket.on('round', (previousRound: RoundResult | undefined) => {
  console.log(previousRound)
  if (previousRound) previousRounds.push(previousRound)
  const last20 = previousRounds.slice(-20)
  const freqR = last20.reduce((prev, r) => ({...prev, [r.opponent as Move]: prev[r.opponent as Move] + 1 }), {ROCK:0,PAPER:0,SCISSORS:0,}) 
  console.log(freqR)
  const r = freqR.ROCK
  const p = freqR.PAPER
  const s = freqR.SCISSORS

  const max = Object.entries(freqR).reduce((prev, a) => (a[1] > prev[1]) ? a : prev, ['', 0])
  
  socket.emit('move', max[0])
  roundIndex++
})
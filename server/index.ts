import { Server, Socket } from 'socket.io'
import { createServer } from 'http'
import express from 'express'
import Match from './Match'
import { ROUND_COUNT, ROUND_DURATION, SERVER_PORT } from './config'
import { Move } from './gameLogic'

const app = express()
const server = createServer(app)
const io = new Server(server)

const connections: Socket[] = []

const match = new Match(ROUND_COUNT, ROUND_DURATION)

io.on('connection', socket => {
  connections.push(socket)

  if (connections.length === 2) {
    startMatch()
  }
  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1)
  })

  console.log("Connections: ", connections.length)
})

server.listen(SERVER_PORT)


function socketToPromiseRepeater(socket: Socket): () => Promise<Move> {
  let latestMove: Move | null = null
  let resolvePromise: ((move: Move) => void) | null = null

  socket.on('move', args => {
    latestMove = args
    resolvePromise?.(args)
  })

  return () => {
    latestMove = null
    return new Promise(resolve => {
      resolvePromise = resolve
    })
  }
}

async function startMatch() {
  const left = connections[0]
  const right = connections[1]
  const getLeftMove = socketToPromiseRepeater(left)
  const getRightMove = socketToPromiseRepeater(right)
  
  match.run(() => {
    left.emit('roundStart')
    return getLeftMove()
  }, () => {
    right.emit('roundStart')
    return getRightMove()
  })

  const result = await match.result
  console.log("Match result: ", result)
}
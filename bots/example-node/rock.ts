import { io } from 'socket.io-client'

function main() {
  const socket = io('http://localhost:3000')
  socket.on('round', () => {
    socket.emit('move', 'ROCK')
  })
}

main()
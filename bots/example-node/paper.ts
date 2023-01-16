import { io } from 'socket.io-client'

function main() {
  const socket = io('http://localhost:3000')
  socket.on('roundStart', () => {
    socket.send('PAPER')
  })
}

main()
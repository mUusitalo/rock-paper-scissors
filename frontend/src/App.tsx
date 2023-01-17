import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import './App.css';
import { SERVER_URL } from './config'; 
import { Bots, Round, Side } from './types';
import RoundDisplay from './RoundDisplay';
import { StartMatchButton } from './StartRoundButton';


const socket = io(SERVER_URL)

function App() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [winningSide, setWinningSide] = useState<Side | null>(null)
  const [startDisabled, setStartDisabled] = useState(true)
  const [bots, setBots] = useState<Bots>({})

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('bots', (bots: Bots) => {
      setBots(bots)
      if (bots.left && bots.right) {
        setStartDisabled(false)
      }
    })

    socket.on('rounds', (data: Round[]) => {
      setRounds(data)
    })

    socket.on('winner', (winningSide: Side) => {
      setWinningSide(winningSide)
    })
  }, [])

  function handleStartClick() {
    socket.emit('start')
    setStartDisabled(true)
  }

  return (
    <div className="App">
      <StartMatchButton onClick={handleStartClick} isDisabled={startDisabled} />
      <RoundDisplay rounds={rounds} />
      {winningSide && <h2>Winner: {winningSide}</h2>}
    </div>
  );
}

export default App;

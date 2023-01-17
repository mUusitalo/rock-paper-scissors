import { RoundLine } from "./RoundLine"
import type { Round } from "./types"

const RoundDisplay = ({rounds} : {rounds: Round[]}) => {
  return (
    <>
      {rounds.map((round, index) => <RoundLine key={index} {...round} />)}
    </>
  )
}

export default RoundDisplay
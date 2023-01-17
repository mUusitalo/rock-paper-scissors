import { Round } from "./types";

export const RoundLine = ({left, right, winner, reason}: Round) => {
  return (
    <div>
      <p>{left ?? 'timeout'}</p>
      <p>vs</p>
      <p>{right ?? 'timeout'}</p>
    </div>
  )
}
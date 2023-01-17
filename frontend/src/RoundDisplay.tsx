import type { Round } from "./types"

const RoundDisplay = ({rounds, leftName, rightName} : {rounds: Round[], leftName: string, rightName: string}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Round</th>
          <th>{leftName}</th>
          <th>{rightName}</th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((round, index) => {
          return (
            <tr>
              <td>{index}</td>
              <td>{round.left ?? 'timeout'}</td>
              <td>{round.right ?? 'timeout'}</td>
            </tr>  
          )}
        )}
      </tbody>
    </table>
  )
}

export default RoundDisplay
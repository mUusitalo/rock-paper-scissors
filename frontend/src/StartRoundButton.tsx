export const StartMatchButton = ({onClick, isDisabled}: {onClick: () => void, isDisabled: boolean}) => (
  <button onClick={onClick} disabled={isDisabled}><h1>Start Match</h1></button>
)
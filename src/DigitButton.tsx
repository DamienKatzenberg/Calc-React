import { ACTIONS } from './App';

export default function DigitButton({ dispatch, digit } : {
    dispatch: React.Dispatch<any>,
    digit: string
}) {
    return (
        <button
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: digit })}
        >
            {digit}
        </button>
    )
}
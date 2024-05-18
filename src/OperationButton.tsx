import { ACTIONS } from './App';

export default function OperationButton({ dispatch, operation }: {
    dispatch: React.Dispatch<any>,
    operation: string
}) {
    return (
        <button
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: operation })
            }
            className="accent-color"
        >
            {operation}
        </button>
    )
}
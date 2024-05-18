import { useEffect, useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './styles.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

interface CalculatorState {
  currentOperand: string | null,
  previousOperand: string | null,
  operation: string | null,
  overwrite: boolean
}

function reducer(state: CalculatorState, { type, payload }: {
  type: string,
  payload: string,
}): CalculatorState {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        if (payload === ".") {
          return { ...state, currentOperand: "0.", overwrite: false }
        }
        return {
          ...state,
          currentOperand: payload,
          overwrite: false
        }
      }
      if (payload === "0" && state.currentOperand === "0") return state;
      if (payload === ".") {
        if (!state.currentOperand) return { ...state, currentOperand: "0." }
        if (state.currentOperand.includes(".")) return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload}`
      }

    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperand: null,
        previousOperand: null,
        operation: null
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload,
        currentOperand: null
      }

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) {
        return state;
      }

      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
  return {
    currentOperand: null,
    previousOperand: null,
    operation: null,
    overwrite: false
  };
}

function evaluate({ currentOperand, previousOperand, operation }: CalculatorState) {
  const prev = previousOperand ? parseFloat(previousOperand) : NaN;
  const current = currentOperand ? parseFloat(currentOperand) : NaN;
  if (isNaN(prev) || isNaN(current)) return "";

  let computation = NaN;
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand: string | null) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(parseFloat(integer));
  return `${INTEGER_FORMATTER.format(parseFloat(integer))}.${decimal}`;
}

function App() {
  const initialState: CalculatorState = {
    currentOperand: null,
    previousOperand: null,
    operation: null,
    overwrite: false
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (parseInt(event.key) || event.key === ".") {
      dispatch({ type: ACTIONS.ADD_DIGIT, payload: event.key });
    } else if (event.key === "/" || event.key === "*" || event.key === "-" || event.key === "+") {
      dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: event.key });
    } else if (event.key === "Enter" || event.key === "=") {
      dispatch({ type: ACTIONS.EVALUATE, payload: "" });
    } else if (event.key === "Backspace") {
      dispatch({ type: ACTIONS.DELETE_DIGIT, payload: "" });
    } else if (event.key === "Escape") {
      dispatch({ type: ACTIONS.CLEAR, payload: "" });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
    // Cleanup function to remove the listener on unmount
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);  // Empty dependency array to run only once

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, initialState)
  return (
    <div className="calculator-container">
      <div className="calculator-grid" >
        <div className="output" >
          <div className="previous-operand" > {formatOperand(previousOperand)} {operation} </div>
          <div className="current-operand" > {formatOperand(currentOperand)} </div>
        </div>
        <button className="span-two accent-color" onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: "" })}> AC </button>
        <button className="accent-color" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT, payload: "" })}> DEL </button>
        < OperationButton dispatch={dispatch} operation="÷" />
        <DigitButton dispatch={dispatch} digit="7" />
        <DigitButton dispatch={dispatch} digit="8" />
        <DigitButton dispatch={dispatch} digit="9" />
        <OperationButton dispatch={dispatch} operation="*" />
        <DigitButton dispatch={dispatch} digit="4" />
        <DigitButton dispatch={dispatch} digit="5" />
        <DigitButton dispatch={dispatch} digit="6" />
        <OperationButton dispatch={dispatch} operation="+" />
        <DigitButton dispatch={dispatch} digit="1" />
        <DigitButton dispatch={dispatch} digit="2" />
        <DigitButton dispatch={dispatch} digit="3" />
        <OperationButton dispatch={dispatch} operation="-" />
        <DigitButton dispatch={dispatch} digit="." />
        <DigitButton dispatch={dispatch} digit="0" />
        <button className="span-two accent-color" onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: "" })}>= </button>
      </div>
    </div>
  )
}

export default App;

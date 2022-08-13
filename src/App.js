import React, {useReducer} from 'react';
import './App.css';

const CALCACTIONS = {
  ADD_DIGIT: 'add-digit',
  ADD_OPERATOR: 'add-operator',
  RESULT: 'calculate-result',
  CLEAR: 'clear-display'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case CALCACTIONS.ADD_DIGIT:
      // specific cases:
      // if a user is clicking '0' and current = 0, display
      // returns current state with current = '0' and previous = either
      // an empty string - if there was no state.previous before - 
      // or what was previously in the state.previous
      if (payload.digit === '0' && state.current === '0') {
        return {
        ...state,
        previous: `${state.previous || ''}`
        }
      }
      
      // if a user is clicking several '.' in a row
      // it checks if there's any '.' in the state.current already
      // and if there are, it returns what alredy is in the state,
      // meaning it doesn't add any more dots
      //‑
      if (payload.digit === '.' && state.current.includes('.')) {
        return state
      }
      if (payload.digit === '.' && /[\+\-\*/]$/.test(state.previous)) {
        return state
      }
      
      if (state.operator !== undefined) {
        return {
          ...state,
          previous: state.operator,
          current: '0'
        }
      }
      
      return {
        ...state,
        current: state.current === '0' ? `${payload.digit}` : `${state.current || ""}${payload.digit}`,
        previous: state.previous === undefined && payload.digit === '0' ? undefined : `${state.previous || ''}${payload.digit}`
      }
      
    case CALCACTIONS.ADD_OPERATOR:
      if (state.previous == null) {
        return state
      }
     
       const regex = /[+*/]$/
       const regexDot = /\.$/
      if (regex.test(state.previous)) {
        if (payload.digit === '-') {
          return {
            ...state,
            previous: `${state.previous}-`
          }
        }
        return {
          ...state,
          previous: `${state.previous.slice(0, -1)}${payload.digit}`
        } 
      } else if (/[+*/-]{2}$/.test(state.previous)) {
        return {
          ...state,
          previous: `${state.previous.slice(0, -2)}${payload.digit}`
        }
      } else if (regexDot.test(state.previous)) {
          return {
            ...state,
            current: `${state.current.slice(0, -1)}`,
            previous: `${state.previous.slice(0, -1)}${payload.digit}`
          }
        }
      
      if (state.operator !== undefined) {
        return {
          ...state,
          previous: `${state.operator}${payload.digit}`,
          current: '0',
          operator: undefined
        }
      }
      return {
        ...state,
        current: '0',
        previous: `${state.previous}${payload.digit}`
      }
      
    case CALCACTIONS.RESULT:
      if (/[+\-*/]$/.test(state.previous)) {
        return {
          ...state,
          previous: `${state.previous.slice(0, -1)}`
        }
      }
      return {
        ...state,
        current: eval(state.previous),
        previous: `${state.previous} = ${eval(state.previous)}`,
        operator: eval(state.previous)
      }
    case CALCACTIONS.CLEAR:
      return {}
    default: 
      return {...state}
  }
}

const App = () => {
  
  const [{current = "0", previous}, dispatch] = useReducer(reducer, {})
  
  const handleClick = (e) => {
    const value = e.currentTarget.textContent
    const target = e.currentTarget.className
    const targetOperator = e.currentTarget.id
    
    if (target === 'button') {
      dispatch({ type: CALCACTIONS.ADD_DIGIT, payload: {digit: value} })
    } else if (target === 'operator') {
      dispatch({ type: CALCACTIONS.ADD_OPERATOR, payload: {digit: value} })
    } else if (targetOperator === 'equals') {
        dispatch({ type: CALCACTIONS.RESULT, payload: {digit: value} })
    } else if (targetOperator === 'clear') {
      dispatch({ type: CALCACTIONS.CLEAR })
    }
  }
  
  return (
    <div id = "viewport">
      <h1 class = 'libraries'>REACT</h1>
      <div id = "calculator">
        <div id = "displaydisplay">
          <p id = "calculation">{previous}</p>
          <h1 id = "display">{current}</h1>
        </div>
        <div id = "keyboard">
          <div id = "col-1">
            <div onClick = {handleClick} class = "button" value = "1" id = "one">1</div>
            <div class = "button" id = "four" onClick = {handleClick}>4</div>
            <div class = "button" id = "seven" onClick = {handleClick}>7</div>
            <div class = "button" id = "zero" onClick = {handleClick}>0</div>
            <div id = "clear" onClick = {handleClick}>C</div>
          </div>
          <div id = "col-2">
            <div class = "button" id = "two" onClick = {handleClick}>2</div>
            <div class = "button" id = "five" onClick = {handleClick}>5</div>
            <div class = "button" id = "eight" onClick = {handleClick}>8</div>
          </div>
          <div id = "col-3">
            <div class = "button" id = "three" onClick = {handleClick}>3</div>
            <div class = "button" id = "six" onClick = {handleClick}>6</div>
            <div class = "button" id = "nine" onClick = {handleClick}>9</div>
            <div class = "button" id = "decimal" onClick = {handleClick}>.</div>
            <div onClick = {handleClick} id = "equals">=</div>
          </div>
          <div id = "col-4">
            <div onClick = {handleClick} class = "operator" id = "add" >+</div>
            <div class = "operator" id = "subtract" onClick = {handleClick}>-</div>
            <div class = "operator" id = "multiply" onClick = {handleClick}>*</div>
            <div class = "operator" id = "divide" onClick = {handleClick}>/</div>
          </div>
        </div>
      </div>
      <h1 class = 'libraries'>SASS</h1>
    </div>
  )
}

export default App;

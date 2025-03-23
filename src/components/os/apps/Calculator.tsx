'use client'

import React, { useState } from 'react'

export default function Calculator({ windowId }: { windowId: string }) {
  const [display, setDisplay] = useState('0')
  const [calculation, setCalculation] = useState('')
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)
  
  const handleNumberClick = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num)
      setShouldResetDisplay(false)
    } else {
      setDisplay(display + num)
    }
  }
  
  const handleOperatorClick = (operator: string) => {
    setCalculation(display + ' ' + operator)
    setShouldResetDisplay(true)
  }
  
  const handleEqualsClick = () => {
    try {
      const fullCalculation = calculation + ' ' + display
      const result = eval(fullCalculation.replace(/×/g, '*').replace(/÷/g, '/'))
      setDisplay(result.toString())
      setCalculation('')
    } catch (error) {
      setDisplay('Error')
    }
    setShouldResetDisplay(true)
  }
  
  const handleClearClick = () => {
    setDisplay('0')
    setCalculation('')
  }
  
  const handleDecimalClick = () => {
    if (shouldResetDisplay) {
      setDisplay('0.')
      setShouldResetDisplay(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-cyber text-cyber-blue mb-4">Calculator</h3>
      
      <div className="bg-cyber-black/40 p-4 rounded-md border border-cyber-blue/20 flex-1">
        <div className="font-mono mb-4">
          <div className="text-cyber-blue/60 h-6 text-right text-sm">
            {calculation}
          </div>
          <div className="text-cyber-blue text-right text-3xl">
            {display}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button 
            className="calc-button bg-cyber-black/60 text-cyber-blue/80 hover:bg-cyber-black hover:text-cyber-blue col-span-2"
            onClick={handleClearClick}
          >
            C
          </button>
          <button 
            className="calc-button bg-cyber-black/60 text-cyber-blue/80 hover:bg-cyber-black hover:text-cyber-blue"
            onClick={() => handleOperatorClick('÷')}
          >
            ÷
          </button>
          <button 
            className="calc-button bg-cyber-black/60 text-cyber-blue/80 hover:bg-cyber-black hover:text-cyber-blue"
            onClick={() => handleOperatorClick('×')}
          >
            ×
          </button>
          
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('7')}
          >
            7
          </button>
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('8')}
          >
            8
          </button>
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('9')}
          >
            9
          </button>
          <button 
            className="calc-button bg-cyber-black/60 text-cyber-blue/80 hover:bg-cyber-black hover:text-cyber-blue"
            onClick={() => handleOperatorClick('-')}
          >
            -
          </button>
          
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('4')}
          >
            4
          </button>
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('5')}
          >
            5
          </button>
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('6')}
          >
            6
          </button>
          <button 
            className="calc-button bg-cyber-black/60 text-cyber-blue/80 hover:bg-cyber-black hover:text-cyber-blue"
            onClick={() => handleOperatorClick('+')}
          >
            +
          </button>
          
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('1')}
          >
            1
          </button>
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('2')}
          >
            2
          </button>
          <button 
            className="calc-button"
            onClick={() => handleNumberClick('3')}
          >
            3
          </button>
          <button 
            className="calc-button bg-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/50 row-span-2"
            onClick={handleEqualsClick}
          >
            =
          </button>
          
          <button 
            className="calc-button col-span-2"
            onClick={() => handleNumberClick('0')}
          >
            0
          </button>
          <button 
            className="calc-button"
            onClick={handleDecimalClick}
          >
            .
          </button>
        </div>
      </div>
    </div>
  )
} 
import { useState } from "react"

export default function CartStepper({value, onChageValue, min=1, max=999 }) {
  const [test, setTest] = useState(value)
  const handleDecrement = () => {
    if(test > min){
      setTest(prev => prev - 1)
    }

  }
  const handleIncrement = () => {
    if(test < max){
      setTest(prev => prev + 1)
    }
  }


  return(
    <div className="flex-2 text-center">
      <button 
      className="border border-gray-400 px-2"
      onClick={handleDecrement}>-</button>
      <span className="px-2">{value}</span>
      <button 
      className="border border-gray-400 px-2"
      onClick={handleIncrement}
      >+</button>

    </div>
  )
}

export default function CartStepper({value, itemId, option, onChageValue, min=1, max=999 }) {
  // const [test, setTest] = useState(value)
  const handleDecrement = () => {
    if(value > min){
      // setTest(prev => prev - 1)
      onChageValue(itemId, option, value-1)
    }

  }
  const handleIncrement = () => {
    if(value < max){
      // setTest(prev => prev + 1)
      onChageValue(itemId, option, value+1)

    }
  }


  return(
    <div className="flex-2 text-center select-none">
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
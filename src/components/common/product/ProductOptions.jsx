function RenderColorOption({color}) {
  if(color.length === 0){
    return;
  }
  
  return(
  <div className="flex gap-2 mt-0.5">
    {color[0].values.map((el,index) => (
      <div key={index+el.hexCode} className={`h-5 w-5 rounded-full border border-gray-400`}
      style={{ backgroundColor: el?.hexCode }}
      ></div>))}
  </div>
  )
}

function RenderSize({size}){
  if(size.length === 0){
    return;
  }

  return(
    <div>
      {size[0].values.map((el,index) => (
        <span key={index+el.display} className="text-gray-700">
          {el.display}
          {index < size[0].values.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  )


}


export default function ProductOptions({options}) {
  // console.log(options)
  const optionsArray = Array.isArray(options) ? options : [];
  const optColor = optionsArray.filter(el => el.id === 'OPT_COLOR');
  // console.log(optColor)
  const optSize = optionsArray.filter(el=> el.id ==='OPT_SIZE')
  return(
  <>
    <RenderColorOption color={optColor} />
    <RenderSize size={optSize} />
  </>
  
)
}

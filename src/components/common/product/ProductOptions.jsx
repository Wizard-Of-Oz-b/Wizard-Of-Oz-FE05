

// function RenderColorOption({color}) {
//   if(color.length === 0){
//     return;
//   }
  
//   return(
//   <div className="flex gap-2 mt-0.5">
//     {color[0].values.map((el,index) => (
//       <div key={index+el.hexCode} className={`h-5 w-5 rounded-full border border-gray-400`}
//       style={{ backgroundColor: el?.hexCode }}
//       ></div>))}
//   </div>
//   )
// }

// function RenderSize({size}){
//   if(size.length === 0){
//     return;
//   }

//   return(
//     <div>
//       {size[0].values.map((el,index) => (
//         <span key={index+el.display} className="text-gray-700">
//           {el.display}
//           {index < size[0].values.length - 1 ? ', ' : ''}
//         </span>
//       ))}
//     </div>
//   )


// }


// export default function ProductOptions({options}) {
//   // console.log(options)

//   const optColor = options.filter(el => el.id === 'OPT_COLOR');
//   // console.log(optColor)
//   const optSize = options.filter(el=> el.id ==='OPT_SIZE')
//   return(
//   <>
//     <RenderColorOption color={optColor} />
//     <RenderSize size={optSize} />
//   </>
  
// )
// }

import { pickColorHex, pickDisplay } from "../../../utils/normalizeOptions";

function RenderColorOption({ color }) {
  const list = Array.isArray(color?.[0]?.values) ? color[0].values : [];
  if (!list.length) return null;

  return (
    <div className="flex gap-2 mt-0.5">
      {list.map((el, index) => {
        const hex = pickColorHex(el);
        return (
          <div
            key={`${index}-${hex}`}
            className="h-5 w-5 rounded-full border border-gray-400"
            style={{ backgroundColor: hex }}
            title={pickDisplay(el)}
          />
        );
      })}
    </div>
  );
}

function RenderSize({ size }) {
  const list = Array.isArray(size?.[0]?.values) ? size[0].values : [];
  if (!list.length) return null;

  return (
    <div>
      {list.map((el, index) => {
        const label = String(pickDisplay(el));
        return (
          <span key={`${index}-${label}`} className="text-gray-700">
            {label}
            {index < list.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </div>
  );
}

export default function ProductOptions({ options }) {
  const list = Array.isArray(options) ? options : [];

  const optColor = list.filter((el) => el.id === "OPT_COLOR");
  const optSize = list.filter((el) => el.id === "OPT_SIZE");

  if (!optColor.length && !optSize.length) return null;

  return (
    <>
      <RenderColorOption color={optColor} />
      <RenderSize size={optSize} />
    </>
  );
}

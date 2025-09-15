import { useState } from 'react';

export default function ProductDropDown({currentSort, onSortChange}){
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return(
  <>
    <div className="relative inline-block text-left cursor-pointer">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className='font-bold text-lg'>정렬 기준</span>
        </button>
      </div>
      <div className={`transition-all duration-300 ease-in-out transform-origin-top 
        ${isOpen? 'scale-y-100 opacity-100 pointer-events-auto' : 
        'scale-y-0 opacity-0 pointer-events-none'}`}>
        {
          <div
            className="origin-top-right absolute border border-gray-300 right-0 mt-2 w-56 shadow-2xl bg-white  focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            <div className="py-1 px-3" role="none" onClick={()=>onSortChange('name')}>
              <span>{currentSort === 'name' && 'V'}이름 순</span>
              <div className="w-[90%] my-1 border-[1px] border-gray-300"></div>
            </div>
            <div className="py-1 px-3" role="none" onClick={()=>onSortChange('-price')}>
              <span>{currentSort === '-price' && 'V'}가격: 낮은 순</span>
              <div className="w-[90%] my-1 border-[1px] border-gray-300"></div>
            </div>
            <div className="py-1 px-3" role="none" onClick={()=>onSortChange('price')}>
              <span>{currentSort === 'price' && 'V'}가격: 높은 순</span>
              <div className="w-[90%] my-1 border-[1px] border-gray-300"></div>
            </div>
            <div className="py-1 px-3" role="none" onClick={()=>onSortChange('created_at')}>
              <span>{currentSort === 'created_at' && 'V'}최신 순</span>
            </div>
          </div>
        }

      </div>
    </div>
  </>
  )
}
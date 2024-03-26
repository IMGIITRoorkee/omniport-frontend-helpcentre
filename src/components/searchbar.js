import React, { useState } from 'react';
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";
import { getTheme } from 'formula_one'
import { themeText } from '../constants/theme'


const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const theme = getTheme();

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value.trim() === '') {
      setOptions([]);
      setShowOptions(false);
    } else {
      setOptions([
        { label: 'Buy and sell section not visible ', tags: ['Buy and sell', 'Login'] },
        { label: 'Buy and sell section not visible ', tags: ['Buy and sell', 'Login'] },
        { label: 'Buy and sell section not visible ', tags: ['Buy and sell', 'Login'] }
      ]); 
      setShowOptions(true); 
    }
  };

  return (
    <div className={tailwindWrapper("flex flex-col items-start relative md:w-[60%]")}>
      <div className={tailwindWrapper(`flex justify-between border-2 ${showOptions ? "bg-[#6435C926] border-[#6435C9]" : "border-[#F5F5F5] bg-white"} items-center pl-4 rounded-lg  md:w-[100%] w-[60%] max-[400px]:w-full mt-2.5 z-20`)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4C4C4C" className={tailwindWrapper("w-5 h-5")}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          placeholder="Search for issues"
          className={tailwindWrapper(`p-2.5 placeholder-gray-400 rounded-lg text-black w-full focus:outline-none bg-transparent`)}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {showOptions && (
        <div className={tailwindWrapper("flex flex-col size-full md:size-auto")}>
          <ul className={tailwindWrapper("absolute bg-white w-full rounded-md shadow-lg -mt-3 z-10 size-full md:size-auto divide-y divide-y-2 divide-[#F5F5F5]")}>
            {options.map((option, index) => (
              <li key={index} className={tailwindWrapper(`px-4 py-2 cursor-pointer hover:bg-gray-100 z-10 ${themeText[theme]}`)}>
                <div className={tailwindWrapper("flex")}>
                  <div className={tailwindWrapper("flex flex-col w-full")}>
                    <div className={tailwindWrapper("text-[#787B8C] font-normal")}>{option.label}</div>
                    <div className={tailwindWrapper("flex flex-wrap mt-1")}>
                      {option.tags.map((tag, tagIndex) => (
                        <div key={tagIndex} className={tailwindWrapper("bg-[#E0D7F4] text-[#6435C9] px-3 py-0.5 rounded-full rounded-s-xl rounded-e-xl mr-4 h-5 text-xs font-medium")}>
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={tailwindWrapper("self-center flex")}>
                    <div className={tailwindWrapper("self-center content-center rounded bg-[#DED0FBA8] w-7 h-7 px-1 py-1")}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" strokeWidth={1.5} stroke="#6435C9" className={tailwindWrapper("w-6 h-6")}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            <li className={tailwindWrapper("px-4 py-2 cursor-pointer hover:bg-gray-100 z-10")}>
              <div className={tailwindWrapper("flex")}>
                <div className={tailwindWrapper("flex flex-wrap mt-1 w-full")}>
                  Report New Issue
                </div>
                <div className={tailwindWrapper("flex flex-wrap mt-1")}>
                  <button className={tailwindWrapper("bg-[#6435C9] text-white px-2 rounded flex")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={tailwindWrapper("w-4 h-4 text-[#7B809A]-700 self-center")}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar

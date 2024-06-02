import React, { useEffect, useState } from 'react';
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";
import { getTheme } from 'formula_one'
import { themeText } from '../constants/theme'
import { urlQueries } from '../urls';
import { getSearch } from '../actions';
import { Link } from 'react-router-dom';


const SearchBar = ({toggleDescription}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = getTheme();

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value.trim() === '') {
      setOptions([]);
      setShowOptions(false);
    } else {
      setIsLoading(true);
      getSearch(value, successCallBack, errCallBack);
    }
  }

  const successCallBack = (response) => {
    const data = response.data;
    setOptions(data);
    setShowOptions(true);
    setIsLoading(false);
  }

  const errCallBack = (error) => {
    console.error("Error occurred: ", error);
    setIsLoading(false)
  }

  const handleReport=(option)=>{
    const {title, query, app, relatedTag} = option
    const data = {
      "title" : title,
      "data" : query,
      "app" : app,
      "relatedTag" : relatedTag
    }
    console.log(data)
    setShowOptions(false);
    toggleDescription(data);
  }

  return (
    <div className={tailwindWrapper("flex flex-col items-start relative md:w-[60%]")}>
      <div className={tailwindWrapper("")}></div>
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
          <ul className={tailwindWrapper("absolute bg-white w-full rounded-md shadow-lg -mt-3 z-10 size-full md:size-auto divide-y divide-y-2 divide-[#F5F5F5] pt-1")}>
            {options.map((option, index) => (
              <li key={index} className={tailwindWrapper(`px-4 py-2 cursor-pointer hover:bg-gray-100 z-10 ${themeText[theme]} pt-2`)}>
                <div className={tailwindWrapper("flex")}>
                  <div className={tailwindWrapper("flex flex-col w-full")}>
                    <div className={tailwindWrapper("text-[#787B8C] font-normal")}>{option.title}</div>
                    <div className={tailwindWrapper("flex flex-wrap mt-1")}>
                      <div className={tailwindWrapper("bg-[#E0D7F4] text-[#6435C9] px-3 py-0.5 rounded-full rounded-s-xl rounded-e-xl mr-4 h-5 text-xs font-medium")}>
                        {option.appName}
                      </div>
                      <div className={tailwindWrapper("bg-[#E0D7F4] text-[#6435C9] px-3 py-0.5 rounded-full rounded-s-xl rounded-e-xl mr-4 h-5 text-xs font-medium")}>
                        {option.relatedTag}
                      </div>
                    </div>
                  </div>
                  <div className={tailwindWrapper("self-center justify-center flex rounded bg-[#DED0FBA8] w-7 h-7")}>
                    <div className={tailwindWrapper("self-center content-center flex")}>
                      <button onClick={() => handleReport(option)}>
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.166992 14V0H7.16699L7.4781 1.64706H11.8337V9.88235H6.38921L6.0781 8.23529H1.72255V14H0.166992Z" fill="#6435C9" />
                      </svg>
                      </button>
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
                  <Link to="/helpcentre/issues" className={tailwindWrapper("mt-auto")}>
                    <button className={tailwindWrapper("bg-[#6435C9] text-white px-2 rounded flex")}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={tailwindWrapper("w-4 h-4 text-[#7B809A]-700 self-center")}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add
                    </button>
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;

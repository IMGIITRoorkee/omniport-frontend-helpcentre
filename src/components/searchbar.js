import React from "react";

import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";

const SearchBar = () => {
  return (
    <div
      className={tailwindWrapper(
        "flex justify-between items-center pl-4 rounded-lg border-2 border-[#F5F5F5] md:w-[40%] w-[60%] max-[400px]:w-full mt-2.5"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#4C4C4C"
        className={tailwindWrapper("w-5 h-5")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        placeholder="Search for issues"
        className={tailwindWrapper(
          "p-2.5 placeholder-gray-400 rounded-lg text-black w-full focus:outline-none"
        )}
      />
    </div>
  );
};

export default SearchBar;

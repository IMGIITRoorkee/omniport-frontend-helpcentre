import React, { useEffect, useState } from "react";

import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";
import { themeText } from "../constants/theme";
import { getTheme } from "formula_one";
import { useRef } from "react";

const AddDescriptionBox = ({ isOpen }) => {

    
  return (
    <div
    //   className={tailwindWrapper(
    //     ""
    //   )}
    >
      {isOpen} &&
      <div>
        <input
          placeholder="Add Description"
          className={tailwindWrapper(
            "p-2.5 placeholder-gray-400 text-black w-full focus:outline-none"
          )}
        />
      </div>
      <div>
        <button
          className={tailwindWrapper(
            `block ml-auto text-white text-sm h-max rounded-md px-6 py-2.5 ${themeBg[theme]}`
          )}
        >
          Cancel
        </button>
        <button
          className={tailwindWrapper(
            `block ml-auto text-white text-sm h-max rounded-md px-6 py-2.5 ${themeBg[theme]}`
          )}
        >
          Report Issue
        </button>
      </div>
      {/* add two button */}
    </div>
  );
};
{
  /* <div>
          <div>Quick Guides</div>
          <div>
            <Article />
          </div>
        </div> */
}

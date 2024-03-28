import React, { useEffect, useState } from "react";

import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";
import { themeBg} from "../constants/theme";
import { getTheme } from "formula_one";


const AddDescriptionBox = ({toggleDescription}) => {

  const theme = getTheme();
  const handleCancel = () => {
    console.log("i am there");
    toggleDescription(false);
  };

  return (
    <div
      className={tailwindWrapper(
        "fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center"
      )}
    >
      <div
        className={tailwindWrapper(
          "bg-white p-4 md:w-1/3 w-3/4 h-1/4 rounded flex flex-col"
        )}
      >
        <div
          className={tailwindWrapper(
            " flex flex-col h-3/4"
          )}
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Add Description
          </h3>
          <input
            className={tailwindWrapper(
              "p-2.5 placeholder-gray-400 my-2 h-3/4 text-black border border-gray-400 w-full focus:outline-none"
            )}
          />
        </div>
        <div className={tailwindWrapper("flex md:flex-row m-2 items-end gap-8")}>
          <button
            className={tailwindWrapper(
              `block text-white text-sm h-max rounded-md px-6 py-2.5 ${themeBg[theme]}`
            )}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className={tailwindWrapper(
              `block text-white text-sm h-max rounded-md px-6 py-2.5 ${themeBg[theme]}`
            )}
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDescriptionBox;

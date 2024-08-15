import React, { useEffect, useState } from "react";
import { connect } from "react-redux"

import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";
import { themeBg } from "../constants/theme";
import { getTheme } from "formula_one";
import { addIssue } from "../actions";


const AddDescriptionBox = ({ toggleDescription, item, app, AddIssue, paginationIndex }) => {
  const theme = getTheme();
  const [description, setDescription] = useState('');

  const handleCancel = () => {
    console.log("i am there");
    toggleDescription(false);
  };

  const handleReport = async () => {

    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('app_name', app); 
    formData.append('query', description);
    console.log(formData)

    AddIssue(
      formData,
      paginationIndex.index,
      paginationIndex.status,
      (res) => {
        console.log("Report submitted successfully");
        toggleDescription(false);
      },
      (err) => {
        console.error("Error submitting report", err);
      }
    );
  };

  return (
    <div
      className={tailwindWrapper(
        "fixed inset-0 z-30 bg-black bg-opacity-20 flex justify-center items-center"
      )}
    >
      <div
        className={tailwindWrapper(
          "bg-white p-4 md:w-1/3 w-3/4 h-1/4 rounded flex flex-col"
        )}
      >
        <div
          className={tailwindWrapper(
            " flex flex-col h-full pt-2"
          )}
        >
          <div className={tailwindWrapper("z-20 ml-2 px-2 mr-auto leading-5 text-base font-medium text-[#9F9F9F] bg-white ")}>
            Add Description
          </div>
          <div className={tailwindWrapper("-mt-2 grow flex flex-col")}>
          <input
            className={tailwindWrapper(
              "p-2.5 placeholder-gray-400 grow h-auto text-[#9F9F9F] text-base border border-gray-400 w-full focus:outline-none z-10"
            )}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          </div>
        </div>
        <div className={tailwindWrapper("flex md:flex-row mt-3 mx-2 justify-end gap-2")}>
          <button
            className={tailwindWrapper(
              `block text-[#6435C9] text-base h-max rounded-md px-5 py-2 border-2 border-[#6435C9] bg-[#E8E1F7]`
            )}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className={tailwindWrapper(
              `block text-white text-base h-max rounded-md px-5 py-2 border-2 border-[#6435C9] ${themeBg[theme]}`
            )}
            onClick={handleReport}
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    paginationIndex: state.paginationIndex
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    AddIssue: (data, index, status, successCallBack, errCallback) => {
      dispatch(addIssue(data, index, status, successCallBack, errCallback));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDescriptionBox);

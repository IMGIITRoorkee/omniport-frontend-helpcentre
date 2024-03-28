import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Dropdown from "./dropdown";
import { OtherApp } from "./icons";
import Accordion from "./accordion";
import Article from "./article-guide";
import AddDescriptionBox from "./add-description";
import SearchBar from "./searchbar";
import { getTheme } from "formula_one";
import { setAppList } from "../actions";
import { faqText } from "../constants/faqText";
import { themeBg, themeBorder } from "../constants/theme";
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";

const Home = ({ appList, SetAppList }) => {
  const [selectedApp, setApp] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDescription,setDescription]=useState(false);
  const theme = getTheme();
  console.log(tailwindWrapper);
  console.log("KFJDKF\n\n\n\n");
  const options = appList.data.map((app, index) => {
    const appData = {
      key: index + 1,
      value: app.nomenclature.verboseName,
      text: app.nomenclature.verboseName,
    };
    if (app.assets && app.assets.favicon) {
      appData["content"] = (
        <img
          src={`/static/${app.baseUrls.static}${app.assets.favicon}`}
          className={tailwindWrapper("h-6 w-6 mr-2.5")}
        />
      );
    }
    return appData;
  });
  options.push({ key: 0, value: "Other", text: "Other" });

  const toggleDescription=({description})=>{
    setDescription(!description);
  }


  useEffect(() => {
    if (!appList.isLoaded) SetAppList();
  }, [appList.isLoaded, SetAppList]);

  return (
    <div>
        <div>
          <div
            className={tailwindWrapper(
              "flex max-[400px]:flex-col gap-3 justify-between"
            )}
          >
            <SearchBar />
            <Link
              to="/helpcentre/issues"
              className={tailwindWrapper("mt-auto")}
            >
              <button
                className={tailwindWrapper(
                  `block ml-auto text-white text-sm h-max rounded-md px-6 py-2.5 ${themeBg[theme]}`
                )}
              >
                Report Issue
              </button>
            </Link>
          </div>
        </div>
        <div
          className={tailwindWrapper(
            "flex flex-col md:flex-row justify-between h-full mt-12 px-4"
          )}
        >
          <div className={tailwindWrapper("md:w-2/4")}>
            <Dropdown
              options={options}
              selectedOption={selectedApp}
              setOption={setApp}
              open={open}
              setOpen={setOpen}
              width={"w-full md:w-2/3"}
              otherContent={OtherApp}
              placeholder={"Select an App"}
            />
            <Accordion
              faqText={faqText}
              toggleDescription={toggleDescription}
            />
          </div>
          <div className={tailwindWrapper("md:w-1/4")}>
            <div>Quick Guides</div>
            <div>
              <Article />
            </div>
          </div>
        </div>
      {openDescription && (
        <AddDescriptionBox toggleDescription={setDescription} />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    appList: state.appList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    SetAppList: () => {
      dispatch(setAppList());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

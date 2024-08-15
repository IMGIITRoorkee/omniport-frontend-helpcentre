import React, { useEffect, useState } from "react";
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper";
import { themeText } from "../constants/theme";
import { getTheme } from "formula_one";
import { useRef } from "react";
import { quickGuide } from "../constants/quickGuide";
// import images from "./../constants/images";

const ArticleItem = ({ item }) => {
  return (
    <div
      className={tailwindWrapper(
        "flex flex-col gap-3 bg-#F5F5F5 border border-#F5F5F5 rounded-lg pt-0"
      )}
    >
      <a href={item.link}>
        <img src="" className={tailwindWrapper("h-25")}></img>
        <p className={tailwindWrapper("text-#677993 font-bold")}>
          {item.project}
        </p>
        <div className={tailwindWrapper("border-t border-black")}></div>
        <p className={tailwindWrapper("text-#677993")}>{item.title}</p>
      </a>
      <p className={tailwindWrapper("text-#999999 text-sm")}>
        {item.guideNumber}
      </p>
    </div>
  );
};

const Article = () => {
  return (
    <div
      className={tailwindWrapper("flex flex-col gap-7 pt-12 text-[#787B8C]")}
    >
      {quickGuide.map((item, index) => (
        <ArticleItem key={index} item={item} />
      ))}
    </div>
  );
};

export default Article;

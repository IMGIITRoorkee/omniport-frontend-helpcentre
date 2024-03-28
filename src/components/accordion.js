import React, { useEffect, useState } from 'react'

import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { themeText } from '../constants/theme'
import { getTheme } from 'formula_one'
import { useRef } from 'react'

const AccordionItem = ({item, isOpen, toggleAccordion, toggleDescription}) => {
    const theme = getTheme()
    const ref = useRef(null)

    const handleReport=()=>{
        toggleDescription(false);
    }

    const [contentHeight, setContentHeight] = useState(0)
    useEffect(() => {
        if (ref.current)
            setContentHeight(ref.current.clientHeight)
    }, [isOpen])

    return (
        <div className={tailwindWrapper("flex flex-col text-[#787B8C]")}>
            <div className={tailwindWrapper(`flex flex-col border-b-2 cursor-pointer`)} onClick={toggleAccordion}>
                <div className={tailwindWrapper("flex flex-row justify-between items-center pb-2.5")}>
                    <span className={tailwindWrapper(`text-lg ${isOpen && "text-black"}`)}>{item.title}</span>
                    <div>{isOpen
                        ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="black" className={tailwindWrapper("w-7 h-8")}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={tailwindWrapper("w-7 h-8 text-[#7B809A]-700")}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>}
                    </div>
                </div>
                <div className={tailwindWrapper(`overflow-hidden transition-all max-h-0 duration-500`)} style={{maxHeight: isOpen ? contentHeight : 0}}>
                    <div ref={ref}>
                            <p className={tailwindWrapper("text-sm leading-2 font-semibold text-[#989DB1]")}>{item.data}</p>
                            <div className={tailwindWrapper("flex justify-content gap-14 pt-2 pb-5 text-md")}>
                                <span className={tailwindWrapper("text-[#676767]")}>Still facing problem?</span>
                                <button className={tailwindWrapper(`${themeText[theme]} font-semibold`)} onClick={handleReport} >Report</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

const Accordion = ({ faqText, toggleDescription }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <div
      className={tailwindWrapper("flex flex-col gap-7 pt-12 text-[#787B8C]")}
    >
      {faqText.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={index === openIndex}
          toggleAccordion={() => toggleAccordion(index)}
          toggleDescription={toggleDescription} 
        />
      ))}
    </div>
  );
};

export default Accordion

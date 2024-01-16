import React from 'react'

import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { themeBorder } from '../constants/theme'
import { getTheme } from 'formula_one'
import { urlStatic } from '../urls'

const Dropdown = ({ options, selectedOption, setOption, open, setOpen, otherContent, width, placeholder }) => {
    const theme = getTheme()

    return (
        <div className={tailwindWrapper(`relative cursor-pointer ${width} ${!open && "border-2 border-[#F5F5F5]"} rounded-sm`)} onClick={() => {setOpen(!open)}}>
            <div className={tailwindWrapper(`w-full p-2 pr-4 flex justify-between items-center ${open ? "border rounded-md " + themeBorder[theme] : ""}`)}>
                <span className={tailwindWrapper(selectedOption === null ? "text-gray-400" : "text-black-400")}>
                    {selectedOption === null ? placeholder : selectedOption}
                </span>
            <img src={`${urlStatic()}dropdown.svg`} alt="Dropdown" className={tailwindWrapper("w-4 h-5")} />
            </div>
            {open && <ul className={tailwindWrapper("absolute w-full bg-white border border-x-2 border-b-2 border-#F5F5F5")}>
                {options && options.map((item) => (
                    <li key={item.key} onClick={() => setOption(item.value, item.text)} className={tailwindWrapper("flex justify-content items-center text-sm px-3 py-2 hover:bg-[#00000008] gap-2")}>
                        {item.content || otherContent()}
                        <span className={tailwindWrapper(selectedOption === item.text ? "font-bold" : "")}>{item.text}</span>
                    </li>
                ))}
            </ul>}
        </div>)}

export default Dropdown

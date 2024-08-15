import React from 'react'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"

const Radio = ({checked, handleClick}) => {
    const toggle = () => {
        handleClick(!checked)
    }
    return (
        <div onClick={toggle} className={tailwindWrapper(`flex w-12 h-6 m-1 rounded-full ${checked ? "bg-blue-500" : "bg-gray-300"}`)}>
            <span className={tailwindWrapper(`h-6 w-6 bg-white rounded-full border transition-all duration-400 ${checked && "ml-6"}`)}></span>
        </div>
    )
}

export default Radio

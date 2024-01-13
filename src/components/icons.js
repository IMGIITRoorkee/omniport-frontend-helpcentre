import React from "react"
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"

export const PendingIcon = ({isActive}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isActive ? "red" : "none"} viewBox="0 0 24 24" strokeWidth={isActive ? "2.5" : "1.5"} stroke={isActive ? "white" : "black"} className={tailwindWrapper("w-6 h-6")}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
)

export const ResolvedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={tailwindWrapper("w-6 h-6")}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

export const AssignedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={tailwindWrapper("w-6 h-5")}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
)

export const OtherApp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={tailwindWrapper("w-6 h-6 mr-2.5")}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L2.5 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
)
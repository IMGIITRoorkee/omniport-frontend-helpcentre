import React, { useEffect, useState } from 'react'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from './icons'
import { themeBg } from '../constants/theme'

import {getTheme} from 'formula_one'

const Pagination = ({ totalPages, activePage, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    const [visibleBtns, setVisibleBtns] = useState([])
    const [maxPageLimit, setMaxPageLimit] = useState(5)
    const [minPageLimit, setMinPageLimit] = useState(1)
    const pageLimit = 5
    const theme = getTheme()

    useEffect(() => {
        if (activePage > maxPageLimit) {
            setMaxPageLimit(maxPageLimit + pageLimit)
            setMinPageLimit(minPageLimit + pageLimit)
        }
        if (activePage < minPageLimit) {
            setMaxPageLimit(maxPageLimit - pageLimit)
            setMinPageLimit(minPageLimit - pageLimit)
        }   

        const visiblePages = pages.filter(
            (page) => page >= minPageLimit && page <= maxPageLimit
        )

        setVisibleBtns(visiblePages)
    }, [activePage, totalPages, maxPageLimit, minPageLimit, pageLimit])

    const dotsStyle = tailwindWrapper(`px-4 py-2 hover:bg-gray-200`)
    const btnStyle = (index) => tailwindWrapper(`${activePage === index ? 'opacity-50 pointer-events-none' : ''} px-4 py-2 hover:bg-gray-200`)

    return (
        <div className={tailwindWrapper("flex items-stretch items-center border justify-start")}>

            <div onClick={() => onPageChange(1)}  className={btnStyle(1)}><ChevronDoubleLeft /></div>
            <div onClick={() => onPageChange(activePage - 1)} className={btnStyle(1)}><ChevronLeft /></div>

            {minPageLimit !== 1 && 
                <div onClick={() => onPageChange(Math.max(1 , minPageLimit - pageLimit))} className={dotsStyle}>...</div>}
            
            {totalPages > 0 
                ? visibleBtns.map((page) => (
                    <div key={page} onClick={() => onPageChange(page)}  className={tailwindWrapper(`px-4 py-2 ${page === activePage ? themeBg[theme] + " text-white" : 'hover:bg-gray-200'}`)}>
                        {page}
                    </div>
                ))
                :   <div className={dotsStyle}>...</div>}

            {totalPages > maxPageLimit && 
                <div onClick={() => onPageChange(Math.min(totalPages, maxPageLimit + pageLimit))} className={dotsStyle}>...</div>}
        
            <div onClick={() => onPageChange(activePage + 1)} className={btnStyle(totalPages)}><ChevronRight /></div>
            <div onClick={() => onPageChange(totalPages)}  className={btnStyle(totalPages)}><ChevronDoubleRight /></div>
        </div>
  )
}

export default Pagination

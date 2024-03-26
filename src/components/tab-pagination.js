import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { BrowserView, MobileView } from 'react-device-detect'

import Pagination from './pagination'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { setIssueList, changePage, setUser, setStatusNumbers } from '../actions'

const TabPagination = ({ issueList, page, SetUser, SetStatusNumbers, SetIssueList, ChangePage }) => {
	const inputRef = useRef(null)
	const [activePage, setActivePage ] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		setTotalPages(Math.ceil(issueList['count'] / 10))
	}, [issueList])

	useEffect(() => {
		setActivePage(page.index)
	}, [page])
	
	useEffect(() => {
		SetUser()
		SetStatusNumbers()
	}, [SetUser, SetStatusNumbers])

	const handlePageChange = (activePage) => {
		if(activePage < 1 || activePage > totalPages) 
			return
		ChangePage(activePage, page.status)
		SetIssueList(activePage, page.status)
		setActivePage(activePage)
	}

	const handleInputChange = (event) => {
		ChangePage(event.target.value, page.status)
		SetIssueList(event.target.value, page.status)
  	}

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
			ChangePage(event.target.value, page.status)
			SetIssueList(event.target.value, page.status)
			inputRef.current.blur()
        }
    }

    return (
    <>
		<div className={tailwindWrapper('flex items-center justify-end p-4')}>
			<BrowserView>
				<Pagination totalPages={totalPages} activePage={activePage} onPageChange={handlePageChange}/>
			</BrowserView>
			<MobileView>
				<div className={tailwindWrapper('flex items-center')}>
					<input
						type="number"
						placeholder={page.index}
						onKeyPress={handleKeyPress}
						ref={inputRef}
						className={tailwindWrapper('border p-1 text-center focus:outline-none w-14')}
					/>
					<span className={tailwindWrapper('mx-2')}>
						of {Math.ceil(issueList.count / 10)}
					</span>
				</div>
			</MobileView>
		</div>
    </>
  )
}

const mapStateToProps = (state) => ({
	whoAmI: state.whoAmI,
	issueList: state.issueList,
	page: state.paginationIndex,
	statusNumbers: state.statusNumbers,
})

const mapDispatchToProps = (dispatch) => ({
    SetUser: () => dispatch(setUser),
    SetIssueList: (id, status) => dispatch(setIssueList(id, status)),
    ChangePage: (index, status) => dispatch(changePage(index, status)),
    SetStatusNumbers: () => dispatch(setStatusNumbers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TabPagination)

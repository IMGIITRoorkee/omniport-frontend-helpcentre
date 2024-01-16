import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { MobileView, BrowserView } from 'react-device-detect'

import { ifRole } from 'formula_one'
import { setIssueList, changePage, setUser, setStatusNumbers } from '../actions'
import { tailwindWrapper } from 'formula_one/src/utils/tailwindWrapper'
import { AssignedIcon, PendingIcon, ResolvedIcon } from './icons'
import Dropdown from './dropdown'

const TabStatus = ({ whoAmI, statusNumbers, SetUser, SetIssueList, ChangePage, SetStatusNumbers,
}) => {
    useEffect(() => {
        SetUser()
        SetStatusNumbers()
        SetIssueList(1, 'opened')
    }, [SetUser, SetIssueList, SetStatusNumbers])

    useEffect(() => {
        setSelectedOption("Opened (" + statusNumbers.open + ")")
    }, [statusNumbers])

    const [selectedOption, setSelectedOption] = useState("Opened (" + statusNumbers.open + ")")
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const handleDropdownChange = (value, option) => {
        ChangePage(1, value)
        SetIssueList(1, value)
        setSelectedOption(option)
    }

    const handleTabChange = (event, data) => {
        const newIndex = data.activeIndex
        setActiveIndex(newIndex)
        let status = 'opened'
        switch (newIndex) {
            case 0:
                status = 'opened'
                break
            case 1:
                status = 'closed'
                break
            case 2:
                status = 'assigned'
                break
            default:
                status = 'opened'
        }
        ChangePage(1, status)
        SetIssueList(1, status)
    }

    const optionsMaintainer = [
    {
        key: 0,
        content: <PendingIcon isActive={true} />,
        value: 'opened',
        text: `Opened (${statusNumbers.open})`,
    },
    {
        key: 1,
        content: <span className={tailwindWrapper("text-green-500")}><ResolvedIcon /></span>,
        value: 'closed',
        text: `Closed (${statusNumbers.close})`,
    },
    {
      key: 2,
      content: <span className={tailwindWrapper("text-blue-500")}><AssignedIcon /></span>,
      value: 'assigned',
      text: `Assigned (${statusNumbers.assign})`,
    }
  ]

    const options = [
    {
        key: 0,
        content: <PendingIcon isActive={true} />,
        value: 'opened',
        text: `Opened (${statusNumbers.open})`,
    },
    {
        key: 1,
        content: <span className={tailwindWrapper("text-blue-500")}><AssignedIcon /></span>,
        value: 'closed',
        text: `Closed (${statusNumbers.close})`,
    }]
    
    const Tab = ({activeStyle, index, children}) => (
        <div className={tailwindWrapper(`flex justfiy-content text-md items-center gap-1 cursor-pointer py-2 pl-3 pr-4 ${activeIndex === index && activeStyle}`)} onClick={() => { handleTabChange(null, { activeIndex: index }) }}>
            {children}
        </div>
    )
    
  return (
    <>
        <BrowserView>
            <div className={tailwindWrapper('mb-4 border-b border-[#DEDEDF]')}>
                <div className={tailwindWrapper('flex items-center justify-between')}>
                    <div className={tailwindWrapper('flex items-center justify-between')}>
                        {ifRole(whoAmI ? whoAmI.roles : [], 'Maintainer') === 'IS_ACTIVE'
                        ?   (<>
                            <Tab index={0} activeStyle="border-b-2 border-red-500 font-semibold text-red-500">
                                <PendingIcon isActive={activeIndex === 0}/>
                                <span>Pending</span>
                                <span className={tailwindWrapper("bg-red-600 text-white text-xs rounded-md font-semibold px-2.5 py-0.5 ml-2")}>{statusNumbers.open}</span>
                            </Tab>
                            <Tab index={1} activeStyle="border-b-2 border-green-500 font-semibold text-green-500">
                                <ResolvedIcon/>
                                <span>Resolved</span>
                                <span className={tailwindWrapper("bg-green-600 text-white text-xs rounded-md font-semibold px-2.5 py-0.5 ml-2")}>{statusNumbers.close}</span>
                            </Tab>
                            <Tab index={2} activeStyle="border-b-2 border-blue-500 font-semibold text-blue-500">
                                <AssignedIcon />
                                <span>Assigned</span>
                                <span className={tailwindWrapper("bg-blue-600 text-white text-xs rounded-md font-semibold px-2.5 py-0.5 ml-2")}>{statusNumbers.assign}</span>
                            </Tab>
                        </>)
                        : ((<>
                            <Tab index={0} activeStyle="border-b-2 border-red-500 font-semibold text-red-500">
                                <PendingIcon isActive={activeIndex === 0}/>
                                        <span>Pending</span>
                                        <span className={tailwindWrapper("bg-red-600 text-white text-xs rounded-md font-semibold px-2.5 py-0.5 ml-2")}>{statusNumbers.open}</span>
                                    </Tab>
                                    <Tab index={1} activeStyle="border-b-2 border-green-500 font-semibold text-green-500">
                                        <ResolvedIcon/>
                                        <span>Resolved</span>
                                        <span className={tailwindWrapper("bg-green-600 text-white text-xs rounded-md font-semibold px-2.5 py-0.5 ml-2")}>{statusNumbers.close}</span>
                                    </Tab>
                        </>)
                        )}
                    </div>
                </div>
            </div>
        </BrowserView>
        <MobileView>
            <div className={tailwindWrapper('w-full flex justify-center')}>
                <Dropdown options={ifRole(whoAmI ? whoAmI.roles : [], 'Maintainer') === 'NOT_ROLE' ? options : optionsMaintainer} selectedOption={selectedOption} setOption={handleDropdownChange} open={open} setOpen={setOpen} width={"w-1/2"}/>
            </div>
        </MobileView>
    </>
  )
}

const mapStateToProps = state => {
  return {
    whoAmI: state.whoAmI,
    issueList: state.issueList,
    page: state.paginationIndex,
    statusNumbers: state.statusNumbers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SetUser: () => {
      dispatch(setUser)
    },
    SetIssueList: (id, status) => {
      dispatch(setIssueList(id, status))
    },
    ChangePage: (index, status) => {
      dispatch(changePage(index, status))
    },
    SetStatusNumbers: () => {
      dispatch(setStatusNumbers())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabStatus)

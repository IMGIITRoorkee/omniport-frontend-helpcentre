import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import Radio from './radio'
import AddAssignees from './add-assignees'
import { ifRole, MaintainerView } from 'formula_one'
import { CrossIcon, QuestionIcon, ShieldIcon, UserIcon } from './icons'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { setActiveIssue, changeStatusActiveIssue, changeAssignees, getMaintainers, setUser, setAllowsPolyjuice, changeAllowsPolyjuice } from '../actions'

const AssignedMaintainer = ({assignee, activeIssue, changeAssignees}) => {
    const handleDelete = (id) => {
        let data = []
        if (typeof activeIssue.assignees[0] === 'object') {
            data = activeIssue.assignees.map((x) => x.id).filter((x) => x !== id)
        } else {
            data = activeIssue.assignees.filter((x) => x !== id)
        }
        changeAssignees(activeIssue.id, data)
    }

    return (<div key={assignee.id} className={tailwindWrapper("py-1 inline-block flex items-stretch items-center mr-2")}>
        {Boolean(assignee.person) && assignee.person.displayPicture 
            ? <img src={assignee.person.displayPicture} alt="Assignee" className={tailwindWrapper("w-8 h-8 rounded-l-md")} />
            :   (<div className={tailwindWrapper("inline-block w-8 h-8 bg-gray-300 pl-2 pr-8 pt-0.5 rounded-l-md")}>
                    <ShieldIcon color={"text-black"}/>
                </div>)}
        <div className={tailwindWrapper("bg-gray-200 inline-block flex gap-2 items-center px-2 py-1 rounded-r-md")}>
            <span className={tailwindWrapper("font-md text-md")}>{Boolean(assignee.person) && assignee.person.fullName}</span>
            <MaintainerView which="helpcentre">
                <span onClick={() => handleDelete(assignee.id)} className={tailwindWrapper("cursor-pointer")}><CrossIcon dimension={"w-4 h-4"} /></span>
            </MaintainerView>
        </div>
    </div>)
}

const SideSegment = ({ SetUser, GetMaintainers, SetActiveIssue, ChangeAssignees, activeIssue, whoAmI, maintainers, allowsPolyjuice, ChangeAllowsPolyjuice, SetAllowsPolyjuice, id}) => {
    const [contextRef, setContextRef] = useState(null)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        SetUser()
        GetMaintainers()
        SetActiveIssue(id)
        SetAllowsPolyjuice()
    }, [SetUser, GetMaintainers, SetActiveIssue, SetAllowsPolyjuice])

    useEffect(() => {
        setChecked(allowsPolyjuice.isLoaded && allowsPolyjuice.data.polyjuiceAllowed)
    }, [allowsPolyjuice.isLoaded, allowsPolyjuice.data.polyjuiceAllowed])

    const getAssigneesFromIndex = (a) => {
        return maintainers.filter((maintainer) => a.includes(maintainer.id))
    }

    const handleChangeAllowPolyjuice = (checked) => {
        setChecked(checked)
        ChangeAllowsPolyjuice(checked)
    }

    return (
        <div className={tailwindWrapper(`border-t-2 rounded-md ${activeIssue.isClosed === true ? 'border-green-500' : 'border-red-500'}`)}>
            <div className={tailwindWrapper("px-4 pt-4 pb-3 border-r border-l border-b rounded-l-md rounded-r-md")}>
                <ul className={tailwindWrapper("divide-y divide-gray-200")}>
                    <li className={tailwindWrapper("pb-2")}>
                        <span className={tailwindWrapper("font-semibold")}>Issue opened on</span><br />
                        {moment(activeIssue.datetimeCreated).format('dddd, MMMM Do YYYY')}
                    </li>
                    <li className={tailwindWrapper("py-2")}>
                        <span className={tailwindWrapper("font-semibold")}>Issue opened at</span><br />
                        {moment(activeIssue.datetimeCreated).format('h:mm a')}
                    </li>
                    <li className={tailwindWrapper("py-2")}>
                        <span className={tailwindWrapper("font-semibold")}>Issue opened by</span>
                        <div className={tailwindWrapper('flex items-center items-stretch')}>
                            {Boolean(activeIssue.uploader) && activeIssue.uploader.displayPicture 
                            ?   (<img src={activeIssue.uploader.displayPicture} alt="Uploader" className={tailwindWrapper('w-8 h-8 rounded-l-md')}/>) 
                            :   (<span className={tailwindWrapper("bg-gray-300 px-2 rounded-l-md")}><UserIcon /></span>)}
                            <span className={tailwindWrapper("bg-gray-100 text-sm rounded-r-md py-1.5 px-2 font-semibold text-gray-500")}>{Boolean(activeIssue.uploader) && activeIssue.uploader.fullName}</span>
                        </div>
                    </li>
                    <li className={tailwindWrapper("py-2")}>
                        <span className={tailwindWrapper("font-semibold")}>App</span><br />{activeIssue.appName}
                    </li>
                    <li className={tailwindWrapper("py-2")}>
                        <span className={tailwindWrapper("font-semibold")}>Allow maintainer access</span>
                        <div>
                            <label className={tailwindWrapper("flex items-center cursor-pointer")}>
                                <Radio checked={checked} handleClick={handleChangeAllowPolyjuice}/>
                                <span className={tailwindWrapper("ml-2 text-sm")}>
                                    Allow maintainers to access your account
                                </span>
                            </label>
                            <div className={tailwindWrapper("ml-1 group relative inline-block cursor-pointer")}>
                                <QuestionIcon />
                                <div className={tailwindWrapper("z-50 w-80 invisible border group-hover:visible opacity-0 group-hover:opacity-100 transition bg-gray-300 absolute text-black-500 text-sm p-2 rounded-md mt-2 bg-[#fff]")}>
                                    This will give one-time access to the maintainers to log in to your account. You can revoke the permission once given. Only allow this if you have full confidence in the maintainer asking you for permission.
                                </div>    
                            </div>
                        </div>
                    </li>
                    {activeIssue.assignees 
                    ?   ((ifRole(whoAmI.roles, 'Maintainer') === 'IS_ACTIVE' && activeIssue.assignees.length !== 0) 
                        && (<li className={tailwindWrapper("py-2")}>
                                <span className={tailwindWrapper("font-semibold")}>Assigned To</span>
                                <div className={tailwindWrapper("py-1 flex justify-normal flex-wrap")}>
                                    {activeIssue.assignees
                                        ? typeof activeIssue.assignees[0] === 'object'
                                            ? activeIssue.assignees.map((assignee) => <AssignedMaintainer assignee={assignee} activeIssue={activeIssue} changeAssignees={ChangeAssignees} />)
                                            : getAssigneesFromIndex(activeIssue.assignees).map((assignee) => <AssignedMaintainer assignee={assignee} activeIssue={activeIssue} changeAssignees={ChangeAssignees} />)
                                        : null}
                                </div>
                    <MaintainerView which="helpcentre">
                        <div className="">
                            <span className={tailwindWrapper("font-semibold")}>Change</span>
                            <AddAssignees />
                        </div>
                    </MaintainerView>
                        </li>)) 
                    : null}
                </ul>
            </div>
        </div>)}

const mapStateToProps = (state) => {
  return {
    maintainers: state.maintainers,
    whoAmI: state.whoAmI,
    activeIssue: state.activeIssue,
    allowsPolyjuice: state.allowsPolyjuice
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    SetUser: () => {
      dispatch(setUser())
    },
    SetActiveIssue: id => {
      dispatch(setActiveIssue(id))
    },
    ChangeStatusActiveIssue: (id, newStatus) => {
      dispatch(changeStatusActiveIssue(id, newStatus))
    },
    ChangeAssignees: (id, assignees) => {
      dispatch(changeAssignees(id, assignees))
    },
    GetMaintainers: () => {
      dispatch(getMaintainers())
    },
    SetAllowsPolyjuice: () => {
      dispatch(setAllowsPolyjuice())
    },
    ChangeAllowsPolyjuice: allowsPolyjuice => {
      dispatch(changeAllowsPolyjuice(allowsPolyjuice))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideSegment)

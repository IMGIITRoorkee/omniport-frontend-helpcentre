import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { isBrowser, isMobile } from 'react-device-detect'
import Emojis from 'react-emoji-component'
import { emojify } from 'react-emojione'

import { urlStatic } from '../urls'
import { ifRole } from 'formula_one'
import { getTheme } from 'formula_one'
import SideSegment from './side-segment'
import PostComment from './post-comment'
import { themeBorder, themeText } from '../constants/theme'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { DownloadIcon, PendingIcon, ResolvedIcon, ShieldIcon } from './icons'
import { setActiveIssue, changeStatusActiveIssue, changeAssignees, getMaintainers, setUser } from '../actions'

const theme = getTheme()

const IssueComment = ({ commenter, datetimeCreated, text }) => (
    <div>
        <div className={tailwindWrapper('flex justify-normal gap-4 mb-6')}>
            <div className={tailwindWrapper("flex-none")}>
                <img className={tailwindWrapper("w-10 border rounded-sm")}
                    src={commenter.displayPicture || `${urlStatic()}manster.svg`}
                    alt="Avatar"
                />
            </div>
            <div className={tailwindWrapper('grow')}>
                <div className={tailwindWrapper('text-md flex items-stretch gap-1 font-semibold items-center')}>
                    {commenter['fullName']}
                    {' '}
                    {ifRole(commenter['roles'], 'Maintainer') === 'IS_ACTIVE' 
                    ? <ShieldIcon color={themeText[theme]}/>
                    : false}
                </div>
                <div className={tailwindWrapper('text-gray-400 text-sm')}>
                    <span>{moment(datetimeCreated).fromNow()}</span>
                </div>
                <div>
                    {isBrowser &&
                        <Emojis size={20} hiDpi>
                            {emojify(text, { output: 'unicode' })}
                        </Emojis>}
                    {isMobile && emojify(text, { output: 'unicode' })}
                </div>
            </div>
        </div>
    </div>)

const Issue = (props) => {
    useEffect(() => {
        const id = props.match.params.id
        props.SetUser()
        props.GetMaintainers()
        props.SetActiveIssue(id, errCallback)
    }, [])

    const errCallback = (err) => props.history.push('/404')

    const toggleIssue = () => {
      const { activeIssue, ChangeStatusActiveIssue } = props
      const id = props.match.params.id
      ChangeStatusActiveIssue(id, !activeIssue['isClosed'])
    }

    const { activeIssue, whoAmI } = props
    const id = props.match.params.id

    return (
        <div className={tailwindWrapper("my-4 border-t sm:w-[90%] w-full")}>
            {!activeIssue.isEmpty 
                ?(<div>
                    {isMobile && 
                        (<div className={tailwindWrapper('grid-row')}>
                                <div className={tailwindWrapper('grid-column')}>
                                    <SideSegment id={id} />
                                </div>
                            </div>
                        )}
                    <div className={tailwindWrapper("flex justify-between gap-4")}>
                        <div className={tailwindWrapper("sm:w-2/3 w-full")}>
                            <div className={tailwindWrapper("text-3xl font-semibold py-4")}>
                                {activeIssue['title']}
                            </div>
                            <div className={tailwindWrapper("flex items-center gap-2.5 pb-4 border-b flex-wrap")}>
                                <span className={tailwindWrapper(`inline-block flex items-center gap-1.5 text-white text-xs rounded-md font-semibold pl-2 pr-3 py-0.5 ${activeIssue.isClosed ? "bg-green-600" : "bg-red-600"}`)}>
                                    <span className={tailwindWrapper("flex-shrink-0")}>{activeIssue.isClosed ? <ResolvedIcon /> : <PendingIcon fill="white" stroke="red" />}</span>  
                                    <span className={tailwindWrapper("flex-shrink-0 flex items-center")}>{activeIssue.isClosed ? "Resolved" : "Pending"}</span>    
                                </span>
                                <span className={tailwindWrapper("inline-block")}>
                                    {isBrowser && (
                                        <span className={tailwindWrapper("text-[#586069]")}>
                                            <b>{activeIssue['uploader'] ? activeIssue['uploader']['fullName'] : ''}</b>
                                            {' '} opened this query {' '}
                                            {moment(activeIssue['datetimeCreated']).fromNow()}
                                            {' '} in {' '}
                                            <b>{activeIssue.appName}</b>
                                            <b>{'  '}·{'  '}</b>
                                        </span>
                                    )}
                                    {activeIssue['comments']
                                        ? activeIssue['comments'].length === 1
                                            ? '1 comment'
                                            : `${activeIssue['comments'].length} comments`
                                        : false}
                                </span>
                            </div>
                            <hr />
                            <div className={tailwindWrapper('py-6')}>
                                <div className={tailwindWrapper('flex justify-normal gap-4 mb-6')}>
                                    <div className={tailwindWrapper("flex-none")}>
                                        <img className={tailwindWrapper("w-10 border rounded-sm")}
                                            src={activeIssue['uploader'] && activeIssue['uploader']['displayPicture'] || `${urlStatic()}manster.svg`}
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className={tailwindWrapper('grow')}>
                                        <div className={tailwindWrapper('text-md font-semibold')}>
                                            {activeIssue['uploader'] && activeIssue['uploader']['fullName']}
                                        </div>
                                        <div className={tailwindWrapper('text-gray-400 text-sm')}>
                                            <span>{moment(activeIssue['datetimeCreated']).fromNow()}</span>
                                        </div>
                                        <div>
                                            {activeIssue['query']}
                                            {activeIssue['uploadedFile'] 
                                            ? (RegExp('^\.jpg$|\.gif$|.png$|\.jpeg$|\.jpg$').test(activeIssue['uploadedFile'])
                                                ?  (<div className={tailwindWrapper('modal')}>
                                                        <img className={tailwindWrapper("max-h-64 w-auto mt-3")}
                                                            src={activeIssue['uploadedFile']}
                                                            alt={activeIssue['id']}
                                                        />
                                                    </div>) 
                                                : (<a href={activeIssue['uploadedFile']} download className={tailwindWrapper(`hover:text-current w-max flex justify-content gap-1 border border-2 my-3 rounded-md ${themeText[theme]} ${themeBorder[theme]} inline-block py-2 pl-5 pr-6 rounded focus:outline-none focus:shadow-outline`)}>
                                                        <DownloadIcon />
                                                        <span>Download attachment</span>
                                                    </a>
                                                )) : null}
                                        </div>
                                    </div>
                                </div>
                                {activeIssue['comments'] &&
                                    activeIssue['comments'].map((comment) => (
                                        <IssueComment
                                            key={comment.id}
                                            commenter={comment['commenter']}
                                            datetimeCreated={comment['datetimeCreated']}
                                            text={comment['text']}
                                        />
                                ))}
                                <div className={tailwindWrapper("flex justify-normal gap-4")}>
                                    <div className={tailwindWrapper("flex-none")}>
                                        <img className={tailwindWrapper("w-10 border rounded-sm")}
                                            src={whoAmI['displayPicture'] || `${urlStatic()}manster.svg`}
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className={tailwindWrapper("grow")}>
                                        <div className={tailwindWrapper("text-md font-semibold")}>{whoAmI ? whoAmI['fullName'] : ''}</div>
                                        <PostComment queryId={id} isClosed={activeIssue.isClosed} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isBrowser && (
                            <div className={tailwindWrapper('py-5')}>
                                <SideSegment id={id} />
                            </div>)}
                        </div>
                    </div>) 
                :(<div className={tailwindWrapper('loader')}></div>)}
        </div>
    )
}

const mapStateToProps = (state) => ({
    maintainers: state.maintainers,
    whoAmI: state.whoAmI,
    activeIssue: state.activeIssue
})

const mapDispatchToProps = (dispatch) => ({
    SetUser: () => {
        dispatch(setUser())
    },
    SetActiveIssue: (id, errCallback) => {
        dispatch(setActiveIssue(id, errCallback))
    },
    ChangeStatusActiveIssue: (id, newStatus) => {
        dispatch(changeStatusActiveIssue(id, newStatus))
    },
    ChangeAssignees: (id, assignees) => {
        dispatch(changeAssignees(id, assignees))
    },
    GetMaintainers: () => {
        dispatch(getMaintainers())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Issue)

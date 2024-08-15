import React, { useState } from 'react'
import { connect } from 'react-redux'

import { MaintainerView } from 'formula_one'
import { CommentIcon, PendingIcon, TickCircleIcon } from './icons'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"
import { addComment, addCommentChangeStatus, changeStatusActiveIssue } from '../actions'

const PostComment = ({ activeIssue, queryId, AddComment, AddCommentChangeStatus, ChangeStatusActiveIssue }) => {
    const [text, setText] = useState('') 
    const handleChange = (e) => {
        setText(e.target.value)
    }

    const comment = () => {
        AddComment(queryId, text)
        setText('')
    }

    const commentChangeStatus = () => {
        AddCommentChangeStatus(queryId, text, !activeIssue.isClosed)
        setText('')
    }

    const openIssue = () => {
        ChangeStatusActiveIssue(queryId, false)
        setText('')
    }

    const commonStyle = `border-2 py-2 px-4 flex items-center px-3 py-2 gap-2`
    return (
        <div className={tailwindWrapper("max-w-xl")}>
            <textarea placeholder="Add a comment to thread..." disabled={activeIssue.isClosed} rows={3} className={tailwindWrapper("w-full p-2 border mb-2 resize-none focus:outline-none focus:shadow-outline")} name="text" value={text} onChange={handleChange}/>
            <div className={tailwindWrapper("flex items-center justify-end")}>
                <div className={tailwindWrapper("flex items-stretch")}>
                    <MaintainerView which="helpcentre">
                        <button
                            onClick={activeIssue.isClosed ? openIssue : commentChangeStatus}
                            disabled={(!activeIssue.isClosed && text.trim() === '')}
                            className={tailwindWrapper(`${commonStyle} ${(text.trim() === '' && !activeIssue.isClosed) && "opacity-50"} rounded-l-md border-gray-600 text-black-500`)}
                        >
                            {activeIssue.isClosed ? <PendingIcon isActive={true} /> : <TickCircleIcon />}
                            {activeIssue.isClosed ? 'Mark pending' : 'Comment and close'}
                        </button>
                    </MaintainerView>
                    <button
                        onClick={comment}
                        disabled={text.trim() === '' || activeIssue.isClosed}
                        className={tailwindWrapper(`${commonStyle} ${text.trim() === '' && "opacity-50"} rounded-r-md border-blue-300 text-blue-500`)}
                    >
                        <CommentIcon />
                        Comment
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    whoAmI: state.whoAmI,
    activeIssue: state.activeIssue,
})

const mapDispatchToProps = dispatch => {
    return {
        AddComment: (id, text) => {
            dispatch(addComment(id, text))
        },
        AddCommentChangeStatus: (id, text, newStatus) => {
            dispatch(addCommentChangeStatus(id, text, newStatus))
        },
        ChangeStatusActiveIssue: (id, newStatus) => {
            dispatch(changeStatusActiveIssue(id, newStatus))
        }
    }
}
export default connect( mapStateToProps, mapDispatchToProps)(PostComment)

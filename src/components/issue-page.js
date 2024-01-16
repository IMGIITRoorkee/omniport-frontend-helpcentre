import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import moment from "moment"

import AddQuery from "./post-issue"
import TabStatus from "./tab-status"
import TabPagination from "./tab-pagination"
import { NonMaintainerView } from "formula_one"
import { PendingIcon, ResolvedIcon } from "./icons"
import { setIssueList, changePage, setUser, setStatusNumbers } from "../actions"
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"

const IssueBar = ({ id, isClosed, title, datetimeCreated, fullName, appName }) => (
    <Link to={`/helpcentre/issue/${id}`} className={tailwindWrapper("hover:text-black")}>
        <div className={tailwindWrapper(`border-t-2 ${isClosed ? "border-green-600" : "border-red-600"} mb-4 rounded-md`)}>
            <div className={tailwindWrapper("border-l border-r border-b border-[#DEDEDF] p-2 rounded-md")}>
                <div className={tailwindWrapper(`flex justify-content items-center p-1 gap-2 ${isClosed ? "text-green" : "text-red"}`)}>
                    {isClosed ? <ResolvedIcon /> : <PendingIcon isActive={true} />}
                    <div>
                        <div className={tailwindWrapper("font-bold")}>{title}</div>
                        <div className={tailwindWrapper("text-[#586069]")}>
                            opened {moment(datetimeCreated).fromNow()} by{" "}
                            <span className={tailwindWrapper("font-bold")}>{fullName}</span> in{" "}
                            <span className={tailwindWrapper("font-bold")}>{appName}</span>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Link>
)

const IssuePage = (props) => {
    useEffect(() => {
        props.setStatusNumbers()
        props.setIssueList(1, "opened")
        props.setUser()
    }, [])

    const createList = () =>
    props.issueList.results ? props.issueList.results.map((issue) => (
          <IssueBar
            key={issue.id}
            id={issue.id}
            isClosed={issue.isClosed}
            title={issue.title}
            datetimeCreated={issue.datetimeCreated}
            fullName={issue.uploader.fullName}
            appName={issue.appName}
          />
        ))
      : [...Array(6)].map((item, index) => (
          <div key={index} className={tailwindWrapper("border p-4 mb-4")}>
            {/* Placeholder UI */}
          </div>
        ))

    return (
        <div>
            <div>
                <NonMaintainerView which="helpcentre">
                <AddQuery history={props.history} />
                </NonMaintainerView>
            </div>
            <div className={tailwindWrapper("md:w-3/4 w-full border rounded-md border-[#DEDEDF] mt-14 mb-4 pt-4")}>
                <span className={tailwindWrapper("flex-grow-2 text-md text-black-500 font-semibold px-4")}>
                    Issues
                </span>
                <div className={tailwindWrapper("my-4")}>
                    <TabStatus />
                </div>
                <div className={tailwindWrapper("px-4")}>{createList()}</div>
                <TabPagination />
            </div>
        </div>
  )
}

const mapStateToProps = (state) => ({
  issueList: state.issueList,
  whoAmI: state.whoAmI,
})

const mapDispatchToProps = (dispatch) => ({
  setUser: () => dispatch(setUser()),
  setIssueList: (id, status) => dispatch(setIssueList(id, status)),
  setStatusNumbers: () => dispatch(setStatusNumbers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(IssuePage)

import { combineReducers } from 'redux'
import WhoAmI from './whoAmI'
import IssueList from './issueList'
import PaginationIndex from './pagination'
import Maintainers from './maintainerslist'
import ActiveIssue from './activeIssue'
import StatusNumbers from './statusNumbers'

const rootReducers = combineReducers({
  whoAmI: WhoAmI,
  issueList: IssueList,
  paginationIndex: PaginationIndex,
  maintainers: Maintainers,
  activeIssue: ActiveIssue,
  statusNumbers: StatusNumbers
})

export default rootReducers

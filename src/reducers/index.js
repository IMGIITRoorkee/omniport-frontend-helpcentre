import { combineReducers } from 'redux'
import WhoAmI from './whoAmI'
import IssueList from './issueList'
import PaginationIndex from './pagination'
import Maintainers from './maintainersList'
import ActiveIssue from './activeIssue'
import StatusNumbers from './statusNumbers'
import AppList from './appList'
import allowsPolyjuice from './allowsPolyjuice'

const rootReducers = combineReducers({
  whoAmI: WhoAmI,
  issueList: IssueList,
  paginationIndex: PaginationIndex,
  maintainers: Maintainers,
  activeIssue: ActiveIssue,
  statusNumbers: StatusNumbers,
  appList: AppList,
  allowsPolyjuice
})

export default rootReducers

import config from '../config.json'

export function urlAppBase () {
  return config.baseUrl
}

export function urlMainApp () {
  return '/api/helpcentre/'
}
export function urlQueries () {
  return `${urlMainApp()}query/`
}

export function urlQueryDetails (id) {
  return `${urlQueries()}${id}/`
}

export function urlComments () {
  return `${urlMainApp()}comments/`
}

export function urlSearchMaintainer () {
  return `/api/yellow_pages/maintainer/`
}

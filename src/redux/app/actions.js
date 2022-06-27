import * as TYPES from './types'

export const setBaseUrl = url => ({
	type: TYPES.SET_BASE_URL,
	payload: url
})

export const setUser = user => ({
	type: TYPES.SET_USER,
	payload: user
})

export const setSearchTitle = searchTitle => ({
	type: TYPES.SET_SEARCH_TITLE,
	payload: searchTitle
})

export const setSearchText = searchText => ({
	type: TYPES.SET_SEARCH_TEXT,
	payload: searchText
})

export const setNotifications = notifications => ({
	type: TYPES.SET_NOTIFICATIONS,
	payload: notifications
})

export const setShowExtract = showExtract => ({
	type: TYPES.SET_SHOW_EXTRACT,
	payload: showExtract
})
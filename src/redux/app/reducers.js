const INITIAL_STATE = {
	baseUrl: '',
	user: null,
	searchTitle: 'Carregando...',
	searchText: '',
	notifications: [],
	showExtract: false,
}

import * as TYPES from './types'


const AppReducer = (state=INITIAL_STATE, action) => {
	switch(action.type){
		case TYPES.SET_BASE_URL:
			return {...state, baseUrl: action.payload}
		case TYPES.SET_USER:
			return {...state, user: action.payload}
		case TYPES.SET_SEARCH_TITLE:
			return {...state, searchTitle: action.payload}
		case TYPES.SET_SEARCH_TEXT:
			return {...state, searchText: action.payload}
		case TYPES.SET_NOTIFICATIONS:
			console.log({payload: action.payload})
			return {...state, notifications: action.payload}
		case TYPES.SET_SHOW_EXTRACT:
			console.log({extract: action.payload})
			return {...state, showExtract: action.payload}
		default:
			return state
	}
}
export default AppReducer
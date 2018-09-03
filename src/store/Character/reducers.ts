import { DeepReadonly } from '@src/utils/immutableHelper'
import { reduxActionTypes } from './actionTypes'
import { Character } from './types'
import Actions from './actions'

export type State = DeepReadonly<Character>

const initialState = {
	data: null,
	isLoading: false
}

export default (state: State = initialState, action: Actions) => {
	switch (action.type) {
		case reduxActionTypes.SET_DATA: {
			return {
				...state,
				data: action.payload
			}
		}
		case reduxActionTypes.SET_LOADING: {
			return {
				...state,
				isLoading: action.payload
			}
		}
		default:
			return state
	}
}

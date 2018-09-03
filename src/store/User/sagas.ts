import { takeLatest, call, put, select } from 'redux-saga/effects'
import { get, mergeWith } from 'lodash-es'
import * as localForage from 'localforage'
import apollo from '@src/apollo'

import { sagaActionTypes } from './actionTypes'
import {
	loadPreferencesQuery,
	idTokenLoginMutation,
	userTokenLoginMutation,
	logoutMutation,
	updatePreferencesMutation
} from './queries'
import Actions from './actions'
import { getData } from './selectors'

// Calls
const loadPreferencesCall = () => {
	return apollo.query({
		query: loadPreferencesQuery,
		fetchPolicy: 'network-only'
	})
}

const loadPreferencesLocalCall = () => {
	return localForage.getItem('userPreferences')
}

const idTokenLoginCall = (idToken: string) => {
	console.log(idToken)
	return apollo.mutate({
		mutation: idTokenLoginMutation,
		variables: { idToken },
		errorPolicy: 'ignore'
	})
}

const userTokenLoginCall = () => {
	return apollo.mutate({
		mutation: userTokenLoginMutation,
		errorPolicy: 'ignore'
	})
}

const logoutCall = () => {
	return apollo.mutate({
		mutation: logoutMutation
	})
}

const updatePreferencesCall = (payload: ReturnType<typeof Actions.updatePreferences>['payload']) => {
	return apollo.mutate({
		mutation: updatePreferencesMutation,
		variables: {
			preferences: payload
		}
	})
}

const updatePreferencesLocalCall = async (payload: ReturnType<typeof Actions.updatePreferences>['payload']) => {
	const preferences = await localForage.getItem('userPreferences')
	localForage.setItem(
		'userPreferences',
		mergeWith(preferences || {}, payload, (a, b) => (b === null ? a : undefined))
	)
}

// Sagas
export function* loadPreferencesSaga() {
	const user = yield select(getData)
	let preferences
	if (user) {
		const response = yield call(loadPreferencesCall)
		preferences = get(response, 'data.user.preferences', null)
	} else {
		preferences = yield call(loadPreferencesLocalCall)
	}

	yield put(Actions.setPreferences(preferences))
}

function* idTokenLoginSaga(action: ReturnType<typeof Actions.idTokenLogin>) {
	const response = yield call(idTokenLoginCall, action.payload)
	yield put(Actions.setData(get(response, 'data.user.login.withIdToken', null)))
}

export function* userTokenLoginSaga() {
	const response = yield call(userTokenLoginCall)
	yield put(Actions.setData(get(response, 'data.user.login.withUserToken', null)))
}

function* logoutSaga() {
	yield put(Actions.setLogoutMessage(true))
	yield put(Actions.clearData())
	yield call(logoutCall)
}

function* updatePreferencesSaga(action: ReturnType<typeof Actions.updatePreferences>) {
	const user = yield select(getData)
	yield put(Actions.setPreferences(action.payload))

	if (user) yield call(updatePreferencesCall, action.payload)
	else yield call(updatePreferencesLocalCall, action.payload)
}

// Watcher
export default function* watchUser() {
	yield takeLatest(sagaActionTypes.ID_TOKEN_LOGIN, idTokenLoginSaga)
	yield takeLatest(sagaActionTypes.LOGOUT, logoutSaga)
	yield takeLatest(sagaActionTypes.UPDATE_PREFERENCES, updatePreferencesSaga)
}

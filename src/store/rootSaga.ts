import { all, takeLatest, call, select, put } from 'redux-saga/effects'

import { userTokenLoginSaga, loadPreferencesSaga } from './User/sagas'
import { getPreferences } from './User/selectors'
import IntlActions from './Intl/actions'
import ResourceActions from './Resources/actions'
import { sagaActionTypes } from './rootActionTypes'
import RootActions from './rootActions'

import userSagas from './User/sagas'
import intlSagas, { loadLocaleSaga } from './Intl/sagas'
import { loadResourceSaga } from './Resources/sagas'
import characterSagas from './Character/sagas'
import skillSagas from './Skills/sagas'
import itemSagas from './Items/sagas'

function* initializeAppSaga() {
	yield call(userTokenLoginSaga)
	yield call(loadPreferencesSaga)
	const userPreferences = yield select(getPreferences)
	yield call(loadLocaleSaga, { payload: userPreferences.locale } as ReturnType<typeof IntlActions.loadLocale>)
	yield call(loadResourceSaga, { payload: userPreferences.locale } as ReturnType<typeof ResourceActions.loadData>)
	yield put(RootActions.setLoading(false))
}

function* rootSaga() {
	yield takeLatest(sagaActionTypes.INIT, initializeAppSaga)
	yield all([userSagas(), intlSagas(), characterSagas(), skillSagas(), itemSagas()])
}

export default rootSaga

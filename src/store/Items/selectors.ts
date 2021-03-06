import { createSelector } from 'reselect'
import { RootState } from '@store/rootReducer'
import { getPreferences } from '@store/User/selectors'

const getItems = (state: RootState) => state.items

export const getIsLoading = createSelector(
	[getItems],
	items => items.isLoading
)
export const getItemPreferences = createSelector(
	[getPreferences],
	preferences => preferences.items
)
export const getData = createSelector(
	[getItems],
	items => items.data
)

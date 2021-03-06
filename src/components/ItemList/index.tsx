import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { groupBy, debounce } from 'lodash-es'
import { Typography } from '@material-ui/core'
import Fuse from 'fuse.js'
import { classes } from '@src/utils/constants'

import T from '@components/T'
import comparators from './comparators'
import ItemListElement from './components/ItemListElement'

import { ItemType } from '@store/constants'
import { RootState } from '@store/rootReducer'
import { getData, getItemPreferences } from '@store/Items/selectors'
import { getResource } from '@store/Resources/selectors'
import { getLocale } from '@store/Intl/selectors'
import ItemActions from '@store/Items/actions'

import { ItemListContainer, ItemListGroup } from './style'

interface PropsFromStore {
	itemData: ReturnType<typeof getData>
	itemPreferences: ReturnType<typeof getItemPreferences>
	resource: ReturnType<typeof getResource>
	locale: ReturnType<typeof getLocale>
}

interface PropsFromDispatch {
	loadItems: typeof ItemActions.loadData
}

interface Props extends PropsFromStore, PropsFromDispatch {
	itemType: ItemType
}

interface State {
	itemData: PropsFromStore['itemData'][ItemType] | undefined
	filteredItemData: { [key: string]: PropsFromStore['itemData'][ItemType] } | undefined
}

class ItemList extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const { itemType, loadItems } = props
		loadItems(itemType)

		this.state = {
			itemData: undefined,
			filteredItemData: undefined
		}
	}

	componentDidMount = () => {
		this.processItems()
	}

	componentDidUpdate = (prevProps: Props) => {
		const { itemData, itemType, itemPreferences, loadItems } = this.props

		if (itemType !== prevProps.itemType) {
			loadItems(itemType)
		}

		if (itemData[itemType] !== prevProps.itemData[itemType]) {
			this.processItems()
		} else if (itemPreferences !== prevProps.itemPreferences) {
			this.debouncedFilterItems()
		}
	}

	processItems = () => {
		const { itemData, itemType, resource, locale } = this.props

		const data = (itemData[itemType] || [])
			.map(item => {
				const nameData = resource.item[item.name]

				if (!nameData) {
					console.error(`[BnSTree] Missing item name data: "${item.name}"`)
					return null
				}

				return {
					...item,
					id: item.name,
					name: nameData.name[locale],
					icon: nameData.icon
				}
			})
			.filter(move => move) as typeof itemData[ItemType]

		this.setState(
			{
				itemData: data
			},
			this.debouncedFilterItems
		)
	}

	filterItems = () => {
		const { itemPreferences } = this.props
		const { itemData } = this.state
		if (!itemData) {
			return null
		}

		let data = itemData.filter(item => {
			return itemPreferences.filter === 'ALL' || !item.classCode || item.classCode === itemPreferences.filter
		})

		if (itemPreferences.search.trim() !== '') {
			const fuseOption = {
				threshold: 0.35,
				keys: ['name']
			}
			const fuse = new Fuse(data, fuseOption)
			data = fuse.search(itemPreferences.search)
		}

		const groupedData = groupBy(data, item => item.group)

		this.setState({ filteredItemData: groupedData })
	}
	debouncedFilterItems = debounce(this.filterItems, 200, { leading: true })

	render = () => {
		const { itemType } = this.props
		const { filteredItemData } = this.state
		const itemData = filteredItemData

		if (!itemData) {
			return null
		}

		return (
			<ItemListContainer>
				{Object.keys(itemData)
					.sort(comparators[itemType])
					.map(group => {
						const groupData = itemData[group]
						if (!groupData) {
							return
						}
						return (
							<ItemListGroup key={group}>
								<Typography variant="subtitle1">
									<T id={['item', 'group_label', itemType, group]} />
								</Typography>
								<div>
									{groupData
										.concat()
										.sort((a, b) => {
											if (!a.classCode) {
												return -1
											}
											if (a.classCode !== b.classCode) {
												return (
													classes.findIndex(c => c.classCode === a.classCode) -
													classes.findIndex(c => c.classCode === b.classCode)
												)
											}
											return a._id > b._id ? 1 : -1
										})
										.map(item => (
											<ItemListElement key={item._id} itemData={item} />
										))}
								</div>
							</ItemListGroup>
						)
					})}
			</ItemListContainer>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		itemData: getData(state),
		itemPreferences: getItemPreferences(state),
		resource: getResource(state),
		locale: getLocale(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			loadItems: ItemActions.loadData
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ItemList)

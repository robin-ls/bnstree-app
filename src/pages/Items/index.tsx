import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { items } from '@src/utils/constants'

import PageContainer from '@components/PageContainer'
import ItemActionBar from '@components/ItemActionBar'
import ItemList from '@components/ItemList'
import FadeContainer from '@components/FadeContainer'

import { RootState } from '@store/rootReducer'
import { ItemType } from '@store/constants'
import { getIsLoading } from '@store/Skills/selectors'

interface PropsFromStore {
	isLoading: ReturnType<typeof getIsLoading>
}

interface Props extends PropsFromStore, RouteComponentProps<{ itemType: string }> {}

const ItemPage: React.SFC<Props> = props => {
	const { match, isLoading } = props

	const itemLink = items.find(c => c.link === match.params.itemType)
	const itemType = itemLink && (itemLink.itemType as ItemType)

	if (!itemType) {
		return null
	}

	return (
		<PageContainer isLoading={isLoading} topNav={<ItemActionBar />}>
			<FadeContainer currentKey={itemType}>
				<ItemList itemType={itemType} />
			</FadeContainer>
		</PageContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		isLoading: getIsLoading(state)
	}
}

export default connect(mapStateToProps)(React.memo(ItemPage))

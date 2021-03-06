import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import T from '@components/T'
import FadeContainer from '@components/FadeContainer'
import PageContainer from '@components/PageContainer'
import CharacterProfile from '@components/CharacterProfile'
import CharacterEquipment from '@components/CharacterEquipment'
import CharacterStats from '@components/CharacterStats'

import { RootState } from '@store/rootReducer'
import { CharacterRegion } from '@store/constants'
import { getData, getIsLoading } from '@store/Character/selectors'
import CharacterActions from '@store/Character/actions'
import UserActions from '@store/User/actions'

import { CharacterLayout } from './style'

interface PropsFromStore {
	characterData: ReturnType<typeof getData>
	isLoading: ReturnType<typeof getIsLoading>
}

interface PropsFromDispatch {
	search: typeof CharacterActions.search
	updatePreferences: typeof UserActions.updatePreferences
}

interface Props extends PropsFromStore, PropsFromDispatch, RouteComponentProps<{ region: string; name: string }> {}

class CharacterPage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props)
		const { match, search, updatePreferences } = props
		const region = match.params.region.toUpperCase() as CharacterRegion
		const name = match.params.name
		if (region && name) {
			updatePreferences({ character: { region: this.validateRegion(region) as CharacterRegion } })
			search({ name, region })
		}
	}

	componentWillUnmount = () => {
		const { search } = this.props
		search(null)
	}

	componentDidUpdate = (prevProps: Props) => {
		const { match, search, updatePreferences } = this.props
		const region = match.params.region.toUpperCase() as CharacterRegion
		const name = match.params.name

		const prevRegion = prevProps.match.params.region.toUpperCase() as CharacterRegion
		const prevName = prevProps.match.params.name

		if (region !== prevRegion || name !== prevName) {
			updatePreferences({ character: { region: this.validateRegion(region) as CharacterRegion } })
			search({ name, region })
		}
	}

	validateRegion = (region: string) => {
		const validRegions = ['NA', 'EU', 'KR', 'TW']
		return validRegions.includes(region) ? region : 'NA'
	}

	render = () => {
		const { characterData, isLoading } = this.props

		return (
			<PageContainer isLoading={!characterData || isLoading}>
				{!characterData ||
				!characterData.profile ||
				!characterData.equipment ||
				!characterData.stats ||
				'failed' in characterData.profile ? (
					<>
						<Typography variant="h2">
							<T id="character.not_found" />
						</Typography>
						{characterData && characterData.profile.failed === 'nameChanged' && (
							<Typography variant="h6" color="textSecondary">
								<T id="character.not_found_name_changed" />
							</Typography>
						)}
					</>
				) : (
					<FadeContainer currentKey={`${characterData.profile.region}-${characterData.profile.name}`}>
						<CharacterProfile
							profileData={characterData.profile}
							otherCharacters={characterData.otherCharacters}
							badges={characterData.badges}
						/>
						<CharacterLayout>
							<CharacterEquipment
								equipmentData={characterData.equipment}
								region={characterData.profile.region}
								className="equipment"
							/>
							<CharacterStats
								statData={characterData.stats}
								type="attack"
								classCode={characterData.profile.classCode}
							/>
							<CharacterStats
								statData={characterData.stats}
								type="defense"
								classCode={characterData.profile.classCode}
							/>
						</CharacterLayout>
					</FadeContainer>
				)}
			</PageContainer>
		)
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		characterData: getData(state),
		isLoading: getIsLoading(state)
	}
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			search: CharacterActions.search,
			updatePreferences: UserActions.updatePreferences
		},
		dispatch
	)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CharacterPage)

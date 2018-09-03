import * as React from 'react'
import { ButtonBase, Typography, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import T from '@src/components/T'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { CharacterStats } from '@src/store/Character/types'
import { ClassCode } from '@src/store/constants'

import * as style from './styles/StatList.css'
import { stats, classElements } from './stats'
import StatListItem from './StatListItem'

interface Props {
	statData: DeepReadonly<CharacterStats>
	type: 'attack' | 'defense'
	classCode: ClassCode
}

interface State {
	showMore: boolean
}

class CharacterStat extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			showMore: false
		}
	}

	render() {
		const { statData, type, classCode } = this.props
		const { showMore } = this.state

		const statList = stats[type].filter(stat => {
			const statId = stat.statId
			return !statId.startsWith('attack_attribute') || classElements[classCode].includes(stat.statId)
		})

		return (
			<div className={style.statList}>
				{statList.map(stat => (
					<Collapse in={stat.essential || showMore}>
						<StatListItem key={stat.statId} stat={stat} statData={statData} />
					</Collapse>
				))}
				<ButtonBase onClick={() => this.setState({ showMore: !showMore })} className={style.expandButton}>
					<Typography variant="caption" color="textSecondary">
						{showMore ? (
							<>
								<T id="character.navigation.show_less" />
								<ExpandLess />
							</>
						) : (
							<>
								<T id="character.navigation.show_more" />
								<ExpandMore />
							</>
						)}
					</Typography>
				</ButtonBase>
			</div>
		)
	}
}

export default CharacterStat

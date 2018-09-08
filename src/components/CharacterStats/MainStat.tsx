import * as React from 'react'
import { Paper, Typography, ButtonBase } from '@material-ui/core'
import * as classNames from 'classnames'
import T from '@src/components/T'
import ImageLoader from '@src/components/ImageLoader'

import { DeepReadonly } from '@src/utils/immutableHelper'
import { CharacterStats } from '@src/store/Character/types'
import { ClassCode } from '@src/store/constants'

import { hmPointBuffs } from './stats'
import * as style from './styles/MainStat.css'
import statIcons from './images/statIcons'
import HMPointDialog from './HMPointDialog'

interface Props {
	statData: DeepReadonly<CharacterStats>
	type: 'attack' | 'defense'
	classCode: ClassCode
}

interface State {
	hmPointDialogOpen: boolean
}

class MainStat extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)

		this.state = {
			hmPointDialogOpen: false
		}
	}

	render() {
		const { statData, type } = this.props
		const { hmPointDialogOpen } = this.state

		const mainStat = type === 'attack' ? 'attack_power_value' : 'max_hp'
		const mainStatValue = statData.total_ability[mainStat]

		return (
			<Paper className={classNames(style.mainStatContainer, style[type])}>
				<div className={style.mainStat}>
					<Typography variant="display1" noWrap className={style.label}>
						<T id={['character', 'stats', mainStat]} />
					</Typography>
					<Typography variant="headline" color="primary">
						{mainStatValue}
					</Typography>
				</div>
				<ButtonBase className={style.hmPointButton} onClick={() => this.setState({ hmPointDialogOpen: true })}>
					<Typography variant="caption" color="textSecondary" className={style.hmPointMain}>
						<ImageLoader src={statIcons[type === 'attack' ? 'attack_power' : 'defense']} />
						{type === 'attack'
							? statData.point_ability.offense_point
							: statData.point_ability.defense_point}P
					</Typography>
					<div>
						{hmPointBuffs[type].map(buff => {
							return (
								<ImageLoader
									key={buff.type}
									src={statIcons[buff.icon]}
									className={classNames(style.hmPointBuff, {
										[style.disabled]: statData.point_ability.picks[buff.index].point === 0
									})}
								/>
							)
						})}
					</div>
				</ButtonBase>
				<HMPointDialog
					type={type}
					pointData={statData.point_ability}
					open={hmPointDialogOpen}
					close={() => this.setState({ hmPointDialogOpen: false })}
				/>
			</Paper>
		)
	}
}

export default MainStat
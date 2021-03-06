import * as React from 'react'
import { Paper } from '@material-ui/core'

import { CharacterStats as CharacterStatsType } from '@store/Character/types'
import { ClassCode } from '@store/constants'

import MainStat from './MainStat'
import StatList from './StatList'

interface Props {
	statData: DeepReadonly<CharacterStatsType>
	type: 'attack' | 'defense'
	classCode: ClassCode
	className?: string
}

const CharacterStats: React.SFC<Props> = props => {
	const { className, ...otherProps } = props
	return (
		<Paper className={className}>
			<MainStat {...otherProps} />
			<StatList {...otherProps} />
		</Paper>
	)
}

export default React.memo(CharacterStats)

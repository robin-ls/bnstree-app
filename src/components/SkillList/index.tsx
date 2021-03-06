import * as React from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'

import T from '@components/T'
import SkillListElement from './components/SkillListElement'

import { RootState } from '@store/rootReducer'
import { getFilteredSkills, getSpecialization } from '@store/Skills/selectors'

import { SkillListContainer, SkillListGroup } from './style'

interface PropsFromStore {
	skillData: ReturnType<typeof getFilteredSkills>
	specialization: ReturnType<typeof getSpecialization>
}

interface Props extends PropsFromStore {}

const SkillList: React.SFC<Props> = props => {
	const { specialization, skillData } = props
	return (
		<SkillListContainer>
			{Object.keys(skillData)
				.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
				.map(group => {
					const groupData = skillData[group]
					return (
						<SkillListGroup key={group}>
							<Typography variant="subtitle1">
								<T id={['skill', 'group_label', 'level']} values={{ level: group }} />
							</Typography>
							<div>
								{groupData.map(skill => (
									<SkillListElement key={skill._id} skill={skill} specialization={specialization} />
								))}
							</div>
						</SkillListGroup>
					)
				})}
		</SkillListContainer>
	)
}

const mapStateToProps = (state: RootState) => {
	return {
		skillData: getFilteredSkills(state),
		specialization: getSpecialization(state)
	}
}

export default connect(mapStateToProps)(SkillList)

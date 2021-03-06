import classIcons from '@src/images/classIcons'

export const API_SERVER =
	process.env.NODE_ENV === 'production'
		? 'https://next-api.bnstree.com'
		: process.env.NODE_ENV === 'staging'
		? 'https://next-api.bnstree.com'
		: 'http://localhost:4001'

export const STATIC_SERVER = 'https://static.bnstree.com'

export const classes = [
	{
		classCode: 'BM',
		link: 'blade-master',
		label: 'general.class_names.BM',
		icon: classIcons.BM
	},
	{
		classCode: 'KF',
		link: 'kung-fu-master',
		label: 'general.class_names.KF',
		icon: classIcons.KF
	},
	{
		classCode: 'DE',
		link: 'destroyer',
		label: 'general.class_names.DE',
		icon: classIcons.DE
	},
	{
		classCode: 'FM',
		link: 'force-master',
		label: 'general.class_names.FM',
		icon: classIcons.FM
	},
	{
		classCode: 'AS',
		link: 'assassin',
		label: 'general.class_names.AS',
		icon: classIcons.AS
	},
	{
		classCode: 'SU',
		link: 'summoner',
		label: 'general.class_names.SU',
		icon: classIcons.SU
	},
	{
		classCode: 'BD',
		link: 'blade-dancer',
		label: 'general.class_names.BD',
		icon: classIcons.BD
	},
	{
		classCode: 'WL',
		link: 'warlock',
		label: 'general.class_names.WL',
		icon: classIcons.WL
	},
	{
		classCode: 'SF',
		link: 'soul-fighter',
		label: 'general.class_names.SF',
		icon: classIcons.SF
	},
	{
		classCode: 'GS',
		link: 'gunslinger',
		label: 'general.class_names.GS',
		icon: classIcons.GS
	},
	{
		classCode: 'WR',
		link: 'warden',
		label: 'general.class_names.WR',
		icon: classIcons.WR
	}
]

export const items = [
	{
		itemType: 'SOULBADGE',
		link: 'soul-badges',
		label: 'general.item_types.SOULBADGE'
	},
	{
		itemType: 'MYSTICBADGE',
		link: 'mystic-badges',
		label: 'general.item_types.MYSTICBADGE'
	},
	{
		itemType: 'SOULSHIELD',
		link: 'soul-shields',
		label: 'general.item_types.SOULSHIELD',
		disabled: true
	}
]

import { ItemType, ClassCode, Attribute } from '@src/store/constants'

interface Items {
	data: { [key in ItemType]: ItemData[] | null }
	isLoading: boolean
}

interface ItemData {
	_id: string
	group: string
	name: string
	grade: number
	classCode?: ClassCode
	stats?: ItemStat[]
	attributes?: ItemAttribute[]
	fuse?: string[]
}

interface ItemStat {
	stat: string
	value: number
	group?: 'm1' | 'm2'
	stage?: number
}

interface ItemAttribute {
	icon?: string
	msg: string
	values?: { [key: string]: any }
	group?: 'm1' | 'm2'
	stage?: number
}

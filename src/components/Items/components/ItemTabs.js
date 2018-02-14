import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import Fade from 'react-reveal/Fade'

import ItemSubMenu from './ItemSubMenu'
import ItemListItem from './ItemListItem'

import { sortedItemDataSelector } from '../selectors'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

const mapStateToProps = state => {
    return {
        data: sortedItemDataSelector(state)
    }
}

const BadgeList = props => {
    const { t, data } = props

    let tabs = []
    data.forEach((group, key) => {
        let items = []
        group.forEach((item, id) => items.push(<ItemListItem item={item} itemId={id} key={id} />))
        tabs.push(
            <TabPane tab={t(key)} key={key}>
                <Fade>
                    <div className="item-list">
                        {items}
                    </div>
                </Fade>
            </TabPane>
        )
    })

    return (
        <div className="item-list-container">
            <ItemSubMenu />
            <Tabs animated>{tabs}</Tabs>
        </div>
    )
}

export default connect(mapStateToProps)(translate('items')(BadgeList))

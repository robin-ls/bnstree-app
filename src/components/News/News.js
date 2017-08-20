import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'

import './styles/News.scss'

import Header from './components/NewsHeader'
import NewsList from './components/NewsList'
import NewsViewer from './components/NewsViewer'
import NewsEditor from './components/NewsEditor'

import {userSelector} from '../../selectors'

const mapStateToProps = state => {
    return {
        user: userSelector(state)
    }
}

const News = props => {
    const {t, user} = props

    let editArticle = user.get('admin', false)
        ? <Route exact path="/news/edit/:id" component={NewsEditor} />
        : <Redirect exact from="/news/edit/:id" to="/news" />

    let newArticle = user.get('admin', false)
        ? <Route exact path="/news/new/:id" component={NewsEditor} />
        : <Redirect exact from="/news/new/:id" to="/news" />

    return (
        <div className="character">
            <Helmet>
                <title>{`${t('news')} | BnSTree`}</title>
            </Helmet>
            <div className="container">
                <Header />
                <div className="main-container">
                    <Switch>
                        <Route exact path="/news" render={() => <NewsList ad />} />
                        {newArticle}
                        {editArticle}
                        <Route path="/news/:id" component={NewsViewer} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps)(translate('general')(News))

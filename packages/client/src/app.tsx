import '@abraham/reflection'
import React from 'react'
import ReactDOM from 'react-dom'
import { initDevtool } from '@sigi/devtool'

import { Home } from './home'

initDevtool()

const renderFunc = window.__SERVER_RENDERED__ ? ReactDOM.hydrate : ReactDOM.render

renderFunc(<Home />, document.getElementById('app'))

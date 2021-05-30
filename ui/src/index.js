import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import * as serviceWorker from './serviceWorker'
import Root from './containers/Root'
import rootSaga from './sagas'
import createStore from './store'

const store = createStore(window.__INITIAL_STATE__)
store.runSaga(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

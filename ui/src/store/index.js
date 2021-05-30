import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import logger from 'redux-logger'

import rootReducer from '../reducers'

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  let middlewares = [sagaMiddleware]

  // show logger only on development version.
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger)
  }

  const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares))

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}

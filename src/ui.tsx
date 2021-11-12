import "reactjs-popup/dist/index.css"
import "react-virtualized/styles.css"
import "./client/assets/styles/main.sass"

import React, { useEffect } from "react"
import { Provider } from "react-redux"
import * as ReactDOM from "react-dom"

import { registerSyncSelectionsService } from "./client/services"
import { App } from "./client/containers"
import store from "./client/store"

function Root() {
  useEffect(() => {
    registerSyncSelectionsService(store)
  }, [])

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

ReactDOM.render(<Root />, document.getElementById("root"))

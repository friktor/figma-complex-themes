import "reactjs-popup/dist/index.css"

import { Provider } from "react-redux"
import * as ReactDOM from "react-dom"
import * as React from "react"

import "react-virtualized-tree/lib/main.css"
import "react-virtualized/styles.css"

import "./client/assets/styles/main.sass"

import { App } from "./client/containers"
import store from "./client/store"

function Root() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

ReactDOM.render(<Root />, document.getElementById("root"))

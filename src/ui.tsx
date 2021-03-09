import { Provider as MobxProvider } from "mobx-react"
import * as ReactDOM from "react-dom"
import { configure } from "mobx"
import * as React from "react"

import "rc-color-picker/assets/index.css"
import "reactjs-popup/dist/index.css"

import "./client/assets/styles/main.sass"

import { ThemeStore } from "./client/store"
import { App } from "./client/containers"

// var scriptTag = document.createElement('script')
// scriptTag.src = "http://localhost:8098"
// document.body.appendChild(scriptTag)

configure({ enforceActions: "never" })

const themeStore = new ThemeStore()
themeStore.loadStyles()

function Root() {
    return (
        <MobxProvider themeStore={themeStore}>
            <App />
        </MobxProvider>
    )
}

ReactDOM.render(<Root />, document.getElementById("root"))

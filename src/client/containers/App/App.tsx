import * as Alert from "react-alert"
import { observer } from "mobx-react"
import * as React from "react"

import { Layout, Route } from "client/containers/Layout"
import { Redrawer } from "client/containers/Redrawer"
import { Library } from "client/containers/Library"
import { Themes } from "client/containers/Themes"
import { AlertMessage } from "./Alert"

const routes: Record<Route, any> = {
    Redrawer,
    Library,
    Themes,
}

export const App = observer(function App() {
    const [ route, setRoute ] = React.useState(Route.Themes)

    const layoutProps = { setRoute, route }
    const View = routes[route]

    const alertProps = {
        position: Alert.positions.BOTTOM_CENTER,
        transition: Alert.transitions.fade,
        timeout: 3500,
        offset: '30px',

        template: AlertMessage,
    }

    return (
        <Layout {...layoutProps}>
            <Alert.Provider {...alertProps}>
                <View />
            </Alert.Provider>
        </Layout>
    )
})

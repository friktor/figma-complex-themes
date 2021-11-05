import { useDispatch } from "react-redux"
import * as Alert from "react-alert"
import * as React from "react"

import { getCurrentThemes } from "client/features/themes"
import { Layout, Route } from "client/components"
import * as Pages from "client/pages"

import { AlertMessage } from "./Alert"

const routes: Record<Route, any> = Pages as any;

export function App() {
  const [route, setRoute] = React.useState(Route.Themes)
  const dispatch = useDispatch()

  const layoutProps = { setRoute, route }
  const View = routes[route]

  React.useEffect(() => {
    dispatch(getCurrentThemes())
  }, []);

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
}

import { observer } from "mobx-react"
import map from "lodash-es/map"
import * as React from "react"
import cx from "classnames"

export enum Route {
    Redrawer = "Redrawer",
    Library = "Library",
    Themes = "Themes",
}

interface IProps {
    setRoute: (route: Route) => void,
    route: Route,

    children: any,
}

export const Layout = observer(function Layout({ children, route: currentRoute, setRoute }: IProps) {
    const tabs = map([ Route.Themes, Route.Redrawer, Route.Library ], (route) => {
        const active = currentRoute === route

        const props = {
            className: cx("tab", { active }),
            onClick: () => setRoute(route),
            key: `tab-${route}-${active}`,
        }

        return (
            <div {...props}>
                {route}
            </div>
        )
    })
    
    return (
        <div className={"layout"}>
            <div className={cx("tabs", currentRoute)}>
                {tabs}
            </div>

            <main>
                {children}
            </main>
        </div>
    )
})

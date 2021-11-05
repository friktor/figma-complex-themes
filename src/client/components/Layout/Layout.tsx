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

export function Layout({ children, route: currentRoute, setRoute }: IProps) {
    const tabs = [ Route.Themes, Route.Redrawer, Route.Library ].map((route) => {
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
}

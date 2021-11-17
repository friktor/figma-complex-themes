import { useSelector } from "react-redux"
import React from "react"
import cx from "classnames"

import { getCreateFormOptions, getEditableStyle } from "client/selectors"
import { CreateForm, Editor } from "client/containers"

export enum Route {
  Redrawer = "Redrawer",
  Library = "Library",
  Themes = "Themes",
}

interface IProps {
  setRoute: (route: Route) => void
  route: Route

  children: any
}

export function Layout({ children, route: currentRoute, setRoute }: IProps) {
  const createFormOptions = useSelector(getCreateFormOptions)
  const editable = useSelector(getEditableStyle)

  const tabs = [Route.Themes, Route.Redrawer, Route.Library].map(route => {
    const active = currentRoute === route

    const props = {
      className: cx("tab", { active }),
      onClick: () => setRoute(route),
    }

    return (
      <div key={`tab-${route}-${active}`} {...props}>
        {route}
      </div>
    )
  })

  return (
    <>
      <div className={cx("layout", { blured: !!editable || !!createFormOptions })}>
        <div className={cx("tabs", currentRoute)}>{tabs}</div>
        <main>{children}</main>
      </div>

      <CreateForm />
      <Editor />
    </>
  )
}

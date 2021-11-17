import React, { MouseEvent, useCallback, useRef } from "react"
import { PopupActions } from "reactjs-popup/dist/types"
import Popup from "reactjs-popup"

import { Icons } from "client/components"

interface Item {
  onClick: (event: MouseEvent<HTMLDivElement, MouseEvent>) => void
  title: string

  iconColor?: string
  iconSize?: number
  icon?: string
}

interface IProps {
  title?: string | JSX.Element
  className?: string
  position?: string
  items: Item[]

  iconColor?: string
  iconSize?: number
  icon?: string

  open?: boolean
}

const _getIcon = (iconName: string, size = 15, color = "rgba(0,0,0, 0.8)") => {
  const Icon: any = Icons[iconName]
  return <Icon color={color} size={size} />
}

export function SelectPopup({
  className,
  position,
  items,
  title,

  iconColor,
  iconSize,
  icon,

  open,
}: IProps) {
  const popupRef = useRef<PopupActions | undefined>()

  const onClick = useCallback(
    (item: Item) => event => {
      item.onClick(event)
      popupRef && popupRef.current.close()
    },
    [items],
  )

  const menu = items.map(item => (
    <div key={`item-${item.icon || item.title}`} className="item" onClick={onClick(item)}>
      {item.icon && _getIcon(item.icon, item.iconSize, item.iconColor)}

      <span>{item.title}</span>
    </div>
  ))

  return (
    <Popup
      position={(position as any) || "bottom center"}
      className="popup-select"
      ref={popupRef}
      open={open}
      on="hover"
      trigger={
        <button className={className || "action"}>
          {icon && _getIcon(icon, iconSize || 18, iconColor)}
          {title && <span>{title}</span>}
        </button>
      }
    >
      <div className="menu">{menu}</div>
    </Popup>
  )
}

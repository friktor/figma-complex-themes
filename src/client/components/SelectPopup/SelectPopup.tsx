import { PopupActions } from "reactjs-popup/dist/types"
import Popup from "reactjs-popup"
import * as React from "react"

import { Icons } from "client/components"

interface Item {
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    title: string,
    
    iconColor?: string,
    iconSize?: number,
    icon?: string,
}

interface IProps {
    title?: string | JSX.Element,
    triggerClassName?: string,
    position?: string,
    items: Item[],
    
    iconColor?: string,
    iconSize?: number,
    icon?: string,
}

const _getIcon = (iconName: string, size = 15, color = "rgba(0,0,0, 0.8)") => {
    const Icon: any = Icons[iconName]
    return <Icon color={color} size={size} />
}

export function SelectPopup({
    triggerClassName,
    position,
    items,
    title,

    iconColor,
    iconSize,
    icon,
}: IProps) {
    const popupRef = React.useRef<PopupActions | undefined>()

    const onClick = React.useCallback((item: Item) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        item.onClick(event)
        popupRef && popupRef.current.close()
    }, [ items ])

    const menu = items.map((item) => (
        <div key={`item-${item.icon || item.title}`} className="item" onClick={onClick(item)}>
            {item.icon && _getIcon(item.icon, item.iconSize, item.iconColor)}
            
            <span>
                {item.title}
            </span>
        </div>
    ))

    return (
        <Popup
            position={(position as any) || "bottom center"}
            className="popup-select"
            ref={popupRef}
            on="hover"

            trigger={(
                <button className={triggerClassName || "action"}>
                    {icon && _getIcon(icon, iconSize || 18, iconColor)}

                    {title && (
                        <span>{title}</span>
                    )}
                </button>
            )}
        >
            <div className="menu">
                {menu}
            </div>
        </Popup>
    )
}

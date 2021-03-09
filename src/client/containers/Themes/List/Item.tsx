import { observer } from "mobx-react"
import * as React from "react"

import { Icons, Input, PaintPreview } from "client/components"
import { Style, useThemes } from "client/store"
import objectSwitch from "utils/objectSwitch"
import { StyleType } from "models"
import * as api from "client/api"

interface IProps {
    style: Style,
}

export const Item = observer(function Item({ style }: IProps) {
    const themeStore = useThemes()

    const availableCollections = []; for (const [ _id, collection ] of themeStore.themes.entries()) {
        availableCollections.push(collection.name)
    }

    const dontCompareSearch = themeStore.search && (
        !style.base.name.includes(themeStore.search)
    )

    const onSelectAllNodesWithStyle = React.useCallback(() => {
        if (!style.base.id.includes("$temp")) {
            api.selectAllFramesByStyle(style.base.id)
        }
    }, [])

    const onOpenEditor = React.useCallback(() => {
        themeStore.toggleModal(style)
    }, [ style ])

    const onRemoveStyle = React.useCallback(() => {
        style.remove()
    }, [ style ])

    const onChange = React.useCallback((params: { value: string }) => {
        style.renameStyle(params.value)
    }, [ style ])

    let preview: JSX.Element = objectSwitch(style.inner.type, {
        [StyleType.PAINT]: (
            <PaintPreview
                paints={(style.inner.properties as any).paints}
                onDoubleClick={onSelectAllNodesWithStyle}
            />
        ),
        [StyleType.TEXT]: (
            <div className="text preview">
                <span>T</span>
            </div>
        ),
    })

    // Return null if have search query and style name not compared with it
    return dontCompareSearch ? null : (
        <div className="item">
            <div className="title">
                {preview}
                
                <div className="name">
                    <Input
                        value={style.base.styleName}
                        validator={/^[a-zA-Z]+$/g}
                        onChange={onChange}
                        name="style"
                    />
                </div>
            </div>

            <div className="actions">
                <div className="action" onClick={onRemoveStyle}>
                    <Icons.Trash color="#f44336" size={16} />
                </div>
                <div className="action" onClick={onOpenEditor}>
                    <Icons.Edit color="#000000" size={16} />
                </div>
            </div>
        </div>
    )
})

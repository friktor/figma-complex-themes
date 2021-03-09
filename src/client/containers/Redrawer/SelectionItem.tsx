import { observer } from "mobx-react"
import * as Alert from "react-alert"
import map from "lodash-es/map"
import * as React from "react"

import { Icons, SelectPopup } from "client/components"
import { useThemes } from "client/store"
import { SelectionEvent } from "models"
import * as api from "client/api"

interface SelectionItemProps {
    selection: SelectionEvent,
}

export const SelectionItem = observer(function SelectionItem({ selection }: SelectionItemProps) {
    const themeStore = useThemes()
    const alert = Alert.useAlert()

    const availableCollections = []; for (const [ _id, collection ] of themeStore.themes.entries()) {
        availableCollections.push(collection.name)
    }

    const [ targetCollection, setTargetCollection ] = React.useState(availableCollections[0])

    const onChangeCollection = React.useCallback((name: string) => () => {
        setTargetCollection(name)
    }, [])

    const onRedraw = React.useCallback(async () => {
        await api.redrawFrame({
            targetThemeCollection: targetCollection,
            sourceFrameId: selection.id,
        })

        alert.success("Redraw finished", {
            type: "success"
        })
    }, [ targetCollection, selection ])

    const actions = map(availableCollections, (name) => ({
        onClick: onChangeCollection(name),
        title: name,
    }))

    return (
        <div className="item selection">
            <div className="name">
                {selection.name}
            </div>
            
            <div className="actions">
                <SelectPopup 
                    title={targetCollection}
                    items={actions}
                />
                
                <div className="action" onClick={onRedraw}>
                    <Icons.Brush size={16} />
                </div>
            </div>
        </div>
    )
})

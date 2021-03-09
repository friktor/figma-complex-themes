import { observer } from "mobx-react"
import * as Alert from "react-alert"
import map from "lodash-es/map"
import * as React from "react"

import { useServices, useThemes } from "client/store"
import { SelectionItem } from "./SelectionItem"
import * as api from "client/api"
import { Icons, SelectPopup } from "client/components"

export const Redrawer = observer(function Redrawer() {
    const themeStore = useThemes()
    const services = useServices()
    const alert = Alert.useAlert()

    const availableCollections = []; for (const [ _id, collection ] of themeStore.themes.entries()) {
        availableCollections.push(collection.name)
    }

    const [ targetCollection, setTargetCollection ] = React.useState(availableCollections[0])

    const onChangeCollection = React.useCallback((name: string) => () => {
        setTargetCollection(name)
    }, [])

    const onRedrawAll = React.useCallback(async () => {
        await Promise.all(map(services.currentSelection, ({ id }) => api.redrawFrame({
            targetThemeCollection: targetCollection,
            sourceFrameId: id,
        })))

        alert.success("Redraw all finished", {
            type: "success"
        })
    }, [])

    const selectionsByName = map(
        services.currentSelection,
        (selection) => selection.name
    ).join(", ")

    const selections = map(services.currentSelection, (selection) => (
        <SelectionItem
            selection={selection}
            key={selection.id}
        />
    ))

    const collectionActions = map(availableCollections, (name) => ({
        onClick: onChangeCollection(name),
        title: name,
    }))
    
    return (
        <div className="page redrawer">
            <div className="header">
                <div className="title">
                    Selected 
                </div>

                {selectionsByName.length > 0 && (
                    <div className="selections">
                        {selectionsByName}
                    </div>
                )}
            </div>

            <div className="content">
                {selections.length > 0 ? (
                    <div className="items">
                        {selections}
                    </div>
                ) : (
                    <div className="empty">
                        <div className="title">
                            Please select layers for redraw
                        </div>
                    </div>
                )}
            </div>

            <div className="toolbar">
                <div className="name">
                    Redraw all by
                </div>
                
                <div className="actions">
                    <SelectPopup 
                        position="top center"
                        title={targetCollection}
                        items={collectionActions}
                    />
                    
                    <div className="action" onClick={onRedrawAll}>
                        <Icons.Brush size={16} />
                    </div>
                </div>
            </div>
        </div>
    )
})

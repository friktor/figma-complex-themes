import { observer } from "mobx-react"
import * as React from "react"

import { Input, SelectPopup } from "client/components"
import { StylesCollection } from "client/store"
import { List } from "./List"

interface IProps {
    collection: StylesCollection,
}

export const Collection = observer(function Collection({ collection }: IProps) {
    const { name: themeName, paintStyles, textStyles } = collection

    const onChangeCollectionName = React.useCallback((params: { value: string }) => {
        collection.rename(params.value)
    }, [ collection ])

    const onCloneCollection = React.useCallback(() => {
        collection.clone("untitled")
    }, [])
    
    const onRemoveCollection = React.useCallback(() => {
        collection.remove()
    }, [])

    const onCreatePaint = React.useCallback(() => {
        collection.addDraftStyle("paint")
    }, [])

    const onCreateText = React.useCallback(() => {
        collection.addDraftStyle("text")
    }, [])

    const actions = [{
        icon: "MenuDots",
        iconSize: 16,
        
        items: [{
            onClick: onCloneCollection,
            title: "Duplicate",
            icon: "Copy",
        }, {
            onClick: onRemoveCollection,
            title: "Remove",
            icon: "Trash",
        }]
    }, {
        icon: "Plus",
        iconSize: 20,
        
        items: [{
            onClick: onCreatePaint,
            title: "Paint Style",
            icon: "Brush",
        }, {
            onClick: onCreateText,
            title: "Text Style",
            icon: "Text",
        }]
    }].map((selectProps) => (
        <SelectPopup
            key={`popup-${selectProps.icon}`}
            {...selectProps}
        />
    ))

    return (
        <div className="collection">
            <div className="title">
                <Input
                    onChange={onChangeCollectionName}
                    validator={/^[a-zA-Z]+$/g}
                    value={themeName}
                    name="name"
                />

                <div className="actions">
                    {actions}
                </div>
            </div>

            <div className="content">
                {paintStyles.size > 0 && (
                    <>
                        <div className="title">Color Styles</div>
                        <List items={paintStyles} />
                    </>
                )}

                {textStyles.size > 0 && (
                    <>
                        <div className="title">Text Styles</div>
                        <List items={textStyles} />
                    </>
                )}
            </div>
        </div>
    )
})

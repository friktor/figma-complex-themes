import { Scrollbar } from "react-scrollbars-custom"
import BeatLoader from "react-spinners/BeatLoader"
import { observer } from "mobx-react"
import map from "lodash-es/map"
import * as React from "react"

import { useServices, useThemes } from "client/store"
import { SelectPopup } from "client/components"
import { ModalEditor } from "../EditorModal"
import { Collection } from "./Collection"
import { Search } from "./Search"

export const Themes = observer(function Themes() {
    const { currentSelection } = useServices()
    const themeStore = useThemes()

    console.log(themeStore)

    const onCreateTempGroup = React.useCallback(() => {
        themeStore.addCollection("Untitled", "group")
    }, [])

    const onCreateTempCollection = React.useCallback(() => {
        themeStore.addCollection("Untitled", "theme")
    }, [])

    const onImportStyles = React.useCallback(() => {
        themeStore.importStylesFromSelected()
    }, [])

    const isEmpty = !themeStore.themes.size && !themeStore.groups.size
    const selections = map(currentSelection, ({ name }) => name)

    if (themeStore.isLoading || !themeStore) {
        return (
            <div className="page themes loading">
                <BeatLoader size={18} color="#18a0fb" />
            </div>
        )
    }

    const groups: JSX.Element[] = []
    for (const [ key, collection ] of themeStore.groups.entries()) {
        groups.push(
            <Collection key={`group-${key}`} collection={collection} />
        )
    }
    
    const themes: JSX.Element[] = []
    for (const [ key, collection ] of themeStore.themes.entries()) {
        themes.push(
            <Collection key={`group-${key}`} collection={collection} />
        )
    }

    let importStylesTitle
    if (selections.length > 0) {
        importStylesTitle = (
            <>
               Import Styles
                <span style={{ opacity: 0.8, fontSize: 9, marginLeft: 2 }}>
                   (From {selections.join(", ")})
                </span> 
            </>
        )
    } else {
        importStylesTitle = (
            <>
               Import Styles
                <span style={{ opacity: 0.8, fontSize: 9, marginLeft: 2 }}>
                   (Please select frames)
                </span> 
            </>
        )
    }

    const actions = [{
        onClick: onCreateTempGroup,
        title: "Create Group",
    }, {
        onClick: onCreateTempCollection,
        title: "Create Collection",
    }, {
        onClick: onImportStyles,
        title: importStylesTitle,
    }]
    
    return (
        <div className="page themes">
            <ModalEditor {...themeStore.modal} />

            <div className="header">
                <Search />

                <div className="actions">
                    <SelectPopup
                        iconColor="#18a0fb"
                        items={actions}
                        iconSize={20}
                        icon="Plus"
                    />
                </div>
            </div>
        
            {!isEmpty ? (
                <Scrollbar noScrollX native={false} className="content">
                    {/* @TODO: thats fast fix of mobx "reaction" after rename style */}
                    {!themeStore.modal.opened && (
                        <>
                            <div className="groups">
                                {groups}
                            </div>

                            {themes}
                        </>
                    )}
                </Scrollbar>
            ) : (
                <div className="empty">
                    <div className="title">
                        Styles is empty, add your first collection
                    </div>
                </div>
            )}
        </div>
    )
})

import { useDropzone } from "react-dropzone"
import { observer } from "mobx-react"
import * as Alert from "react-alert"
import map from "lodash-es/map"
import * as React from "react"

import { SelectPopup } from "client/components"
import { useLibrary } from "client/store"
import { SerializedTheme } from "models"
import { ThemeItem } from "./ThemeItem"
import { delay } from "utils/delay"

export const Library = observer(function Library() {
    const alert = Alert.useAlert()
    const library = useLibrary()
    const { themes } = library
    
    const onImportCurrentTheme = React.useCallback(async () => {
        await library.importCurrentTheme()
        await delay(150)
        await library.importLibraries()
        
        alert.success("Theme saved in library", {
            type: "success"
        })
    }, [])

    const onDrop = React.useCallback(async (files: File[]) => {
        const _iterator = (file: File) => new Promise<SerializedTheme | undefined>((resolve) => {
            const reader = new FileReader()

            reader.onload = () => {
                const text = reader.result

                try {
                    const theme = JSON.parse(text as any)
                    resolve(theme)
                } catch (error) {
                    resolve(undefined)
                }
            }

            reader.onerror = () => {
                resolve(undefined)
            }

            reader.readAsText(file)
        })
        
        const output = await Promise.all(map(files, _iterator))
        const data = output.filter(t => !!t)
        
        await library.importThemes(data)
        
        alert.success("Import completed", {
            type: "success"
        })
    }, [])

    const {
        getInputProps,
        getRootProps,
        isDragActive,
        open,
    } = useDropzone({
        accept: "application/json",
        multiple: true,
        noClick: true,
        onDrop,
    })

    const items: JSX.Element[] = []
    
    for (const [ key, theme ] of themes.entries()) {
        items.push(
            <ThemeItem key={`theme-${key}`} theme={theme} />
        )
    }

    return (
        <div className="page library">
            <div className="header">
                <div className="title">
                    Library Themes
                </div>
                
                <div className="actions">
                    <SelectPopup
                        icon="MenuDots"
                        iconSize={16}
                        items={[{
                            onClick: onImportCurrentTheme,
                            title: "Create from page",
                            icon: "Plus",
                        }, {
                            title: "Import from JSON",
                            onClick: open,
                            icon: "Load",
                        }]}
                    />
                </div>
            </div>

            <div className="content" {...getRootProps()}>
                <input {...getInputProps()} />

                {isDragActive ? (
                    <div className="dropzone">
                        <div className="title">
                            Drop JSON files with themes here...
                        </div>
                    </div>
                ) : (items.length > 0) ? (
                    <div className="items">
                        {items}
                    </div>
                ) : (
                    <div className="empty">
                        <div className="title">
                            Library is empty
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
})

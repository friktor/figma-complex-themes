import { observer } from "mobx-react"
import * as Alert from "react-alert"
import * as React from "react"
import { toJS } from "mobx"

import { Input, SelectPopup } from "client/components"
import { useLibrary } from "client/store"
import { SerializedTheme } from "models"

interface IProps {
    theme: SerializedTheme,
}

function downloadJSON(name = "untitled", data: any) {
    const filename = `${name}.json`

    var blob = new Blob(
        [ JSON.stringify(data, null, 4) ],
        { type: "text/plain" },
    )

    let event = document.createEvent("MouseEvents")
    let element = document.createElement("a")

    element.download = filename
    element.href = window.URL.createObjectURL(blob)
    element.dataset.downloadurl = ["text/plain", element.download, element.href].join(":")
    event.initEvent("click", true, false)
    element.dispatchEvent(event)
}

export const ThemeItem = observer(function ThemeItem({ theme }: IProps) {
    const alert = Alert.useAlert()
    const library = useLibrary()

    const onMergeWithPageCollection = React.useCallback(async () => {
        await library.mergeWithCurrent(toJS(theme))
        
        alert.success("Merge with current finished", {
            type: "success"
        })
    }, [ theme ])

    const onRemoveLibraryTheme = React.useCallback(() => {
        library.removeTheme(toJS(theme))
    }, [ theme ])

    const onDownloadJson = React.useCallback(() => {
        downloadJSON(theme.name, toJS(theme))
    }, [ theme ])

    const onChangeName = React.useCallback((params: { value: string }) => {
        library.renameTheme(theme.name, params.value)
    }, [ theme ])

    return (
        <div className="theme item">
            <Input
                validator={/^[a-zA-Z]+$/g}
                onChange={onChangeName}
                value={theme.name}
                name="title"
            />

            <div className="actions">
                <SelectPopup
                    icon="MenuDots"
                    iconSize={16}
                    items={[{
                        onClick: onMergeWithPageCollection,
                        title: "Merge with current theme",
                    }, {
                        onClick: onDownloadJson,
                        title: "Download JSON",
                    }, {
                        onClick: onRemoveLibraryTheme,
                        title: "Remove theme",
                    }]}
                />
            </div>
        </div>
    )
})

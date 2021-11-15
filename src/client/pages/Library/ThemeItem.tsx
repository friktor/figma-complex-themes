import { useDispatch } from "react-redux"
import * as Alert from "react-alert"
import * as React from "react"

import { Input, SelectPopup } from "client/components"
import { getLibrary } from "client/features/themes"
import { SerializedTheme } from "models"
import * as api from "client/api"

interface IProps {
  theme: SerializedTheme
}

function downloadJSON(name = "untitled", data: any) {
  const filename = `${name}.json`

  const blob = new Blob([JSON.stringify(data, null, 4)], { type: "text/plain" })
  const event = document.createEvent("MouseEvents")
  const element = document.createElement("a")

  element.download = filename
  element.href = window.URL.createObjectURL(blob)
  element.dataset.downloadurl = ["text/plain", element.download, element.href].join(":")
  event.initEvent("click", true, false)
  element.dispatchEvent(event)
}

export function ThemeItem({ theme }: IProps) {
  const alert = Alert.useAlert()
  const dispatch = useDispatch()

  const onMergeWithPageCollection = React.useCallback(async () => {
    await api.mergeSerializedThemeWithCurrent(theme)
    dispatch(getLibrary())

    alert.success("Merge with current finished", {
      type: "success",
    })
  }, [theme])

  const onRemoveLibraryTheme = React.useCallback(async () => {
    await api.removeThemeFromLibrary(theme)
    dispatch(getLibrary())
  }, [theme])

  const onDownloadJson = React.useCallback(() => {
    downloadJSON(theme.name, theme)
  }, [theme])

  const onChangeName = React.useCallback(
    async (params: { value: string }) => {
      await api.renameLibraryTheme({
        newname: params.value,
        oldname: theme.name,
      })

      dispatch(getLibrary())
    },
    [theme],
  )

  return (
    <div className="theme item">
      <Input validator={/^[a-zA-Z]+$/g} onChange={onChangeName} value={theme.name} name="title" />

      <div className="actions">
        <SelectPopup
          icon="MenuDots"
          iconSize={16}
          items={[
            {
              onClick: onMergeWithPageCollection,
              title: "Merge with current theme",
            },
            {
              onClick: onDownloadJson,
              title: "Download JSON",
            },
            {
              onClick: onRemoveLibraryTheme,
              title: "Remove theme",
            },
          ]}
        />
      </div>
    </div>
  )
}

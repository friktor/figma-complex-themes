import { useDispatch, useSelector } from "react-redux"
import { useDropzone } from "react-dropzone"
import React, { useCallback } from "react"
import * as Alert from "react-alert"

import { getLibrary } from "client/features/themes"
import { getFullLibrary } from "client/selectors"
import { SelectPopup } from "client/components"
import { SerializedTheme } from "models"
import { ThemeItem } from "./ThemeItem"
import { delay } from "utils/delay"
import * as api from "client/api"

const { values } = Object

export function Library() {
  const library = useSelector(getFullLibrary)
  const alert = Alert.useAlert()
  const dispatch = useDispatch()

  const onImportCurrentTheme = useCallback(async () => {
    await api.serializeCurrentPageTheme()
    await delay(150)
    dispatch(getLibrary())

    alert.success("Theme saved in library", {
      type: "success",
    })
  }, [])

  const onDrop = useCallback(async (files: File[]) => {
    const _iterator = (file: File) =>
      new Promise<SerializedTheme | undefined>(resolve => {
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

    const output = await Promise.all(files.map(_iterator))
    const serializedThemes = output.filter(t => !!t)

    await Promise.all(serializedThemes.map(theme => api.setLibraryTheme(theme)))
    dispatch(getLibrary())

    alert.success("Import completed", {
      type: "success",
    })
  }, [])

  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    accept: "application/json",
    multiple: true,
    noClick: true,
    onDrop,
  })

  const items: JSX.Element[] = values(library).map(theme => <ThemeItem key={`theme-${theme.name}`} theme={theme} />)

  return (
    <div className="page library">
      <div className="header">
        <div className="title">Library Themes</div>

        <div className="actions">
          <SelectPopup
            icon="MenuDots"
            iconSize={16}
            items={[
              {
                onClick: onImportCurrentTheme,
                title: "Create from page",
                icon: "Plus",
              },
              {
                title: "Import from JSON",
                onClick: open,
                icon: "Load",
              },
            ]}
          />
        </div>
      </div>

      <div className="content" {...getRootProps()}>
        <input {...getInputProps()} />

        {isDragActive ? (
          <div className="dropzone">
            <div className="title">Drop JSON files with themes here...</div>
          </div>
        ) : items.length > 0 ? (
          <div className="items">{items}</div>
        ) : (
          <div className="empty">
            <div className="title">Library is empty</div>
          </div>
        )}
      </div>
    </div>
  )
}

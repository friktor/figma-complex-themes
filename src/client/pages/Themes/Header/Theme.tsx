import { ListRowProps } from "react-virtualized"
import React, { useCallback } from "react"
import { useDispatch } from "react-redux"

import {
  cloneCollection,
  createStyle,
  createThemeGroup,
  removeCollection,
  renameCollection,
} from "client/features/themes"
import { Input, SelectPopup } from "client/components"

interface IProps {
  row: ListRowProps

  item: {
    styleType: "paint" | "text"
    type: "THEME_HEADER"
    title: string
    theme: string
  }
}

export function Theme({ item, row }: IProps) {
  const dispatch = useDispatch()

  const onChangeThemeName = useCallback(
    (params: { value: string }) => {
      dispatch(
        renameCollection({
          type: item.styleType,
          new: params.value,
          old: item.theme,
        }),
      )
    },
    [item],
  )

  const onCloneTheme = useCallback(() => {
    dispatch(
      cloneCollection({
        type: item.styleType,
        new: "UntitledTheme",
        old: item.theme,
      }),
    )
  }, [])

  const onRemoveTheme = useCallback(() => {
    dispatch(
      removeCollection({
        type: item.styleType,
        name: item.theme,
      }),
    )
  }, [item])

  const onCreateThemeGroup = useCallback(() => {
    dispatch(
      createThemeGroup({
        theme: item.theme,
        group: "Untitled",
        type: item.styleType,
      }),
    )
  }, [item])

  const onCreateStyle = useCallback(() => {
    dispatch(
      createStyle({
        styleType: item.styleType.toUpperCase() as any,
        group: "UntitledGroup",
        theme: item.theme,
        name: "Untitled",
      }),
    )
  }, [item])

  const actions = [
    {
      icon: "MenuDots",
      iconSize: 16,

      items: [
        {
          onClick: onCloneTheme,
          title: "Duplicate",
          icon: "Copy",
        },
        {
          onClick: onRemoveTheme,
          title: "Remove",
          icon: "Trash",
        },
      ],
    },
    {
      icon: "Plus",
      iconSize: 20,

      items: [
        {
          onClick: onCreateThemeGroup,
          title: "Create Group",
          icon: "Folder",
        },
        {
          onClick: onCreateStyle,
          title: "Create Style",
          icon: item.styleType === "paint" ? "Brush" : "Text",
        },
      ],
    },
  ]

  return (
    <div key={row.key} style={row.style} className="header theme">
      <Input onChange={onChangeThemeName} validator={/^[a-zA-Z]+$/g} value={item.theme} name="name" />
      <div className="actions">
        {actions.map(selectProps => (
          <SelectPopup key={`popup-${selectProps.icon}`} {...selectProps} />
        ))}
      </div>
    </div>
  )
}

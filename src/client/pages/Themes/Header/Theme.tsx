import { ListRowProps } from "react-virtualized"
import React, { useCallback } from "react"
import { useDispatch } from "react-redux"

import { cloneCollection, removeCollection, renameCollection, setCreateFormOptions } from "client/features/themes"
import { Icons, Input, SelectPopup } from "client/components"
import { StyleType } from "models"

interface IProps {
  row: ListRowProps

  item: {
    styleType: StyleType
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
      setCreateFormOptions({
        type: item.styleType,
        target: "theme_group",
        theme: item.theme,
      }),
    )
  }, [item])

  const menu = {
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
  }

  return (
    <div key={row.key} style={row.style} className="header theme">
      <Input onChange={onChangeThemeName} validator={/^[a-zA-Z]+$/g} value={item.theme} name="name" />

      <div className="actions">
        <SelectPopup {...menu} />

        <div className="action" onClick={onCreateThemeGroup}>
          <Icons.Plus size={20} />
        </div>
      </div>
    </div>
  )
}

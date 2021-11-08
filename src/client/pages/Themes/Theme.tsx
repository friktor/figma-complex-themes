import { ListRowProps } from "react-virtualized"
import React, { useCallback } from "react"

import { Input, SelectPopup } from "client/components"

interface IProps {
  row: ListRowProps

  item: {
    type: "THEME_HEADER"
    title: string
    theme: string
  }
}

export function Theme({ item, row }: IProps) {
  const onChangeThemeName = useCallback((params: { value: string }) => {
    // @TODO:
  }, [])

  const onCloneTheme = useCallback(() => {
    // @TODO:
  }, [])

  const onRemoveTheme = useCallback(() => {
    // @TODO:
  }, [])

  const onCreatePaint = useCallback(() => {
    // @TODO:
  }, [])

  const onCreateText = useCallback(() => {
    // @TODO:
  }, [])

  const actions = [{
    icon: "MenuDots",
    iconSize: 16,

    items: [{
      onClick: onCloneTheme,
      title: "Duplicate",
      icon: "Copy",
    }, {
      onClick: onRemoveTheme,
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
    <div key={row.key} style={row.style} className="theme">
      <Input
        onChange={onChangeThemeName}
        validator={/^[a-zA-Z]+$/g}
        value={item.theme}
        name="name"
      />

      <div className="actions">
        {actions}
      </div>
    </div>
  )
}

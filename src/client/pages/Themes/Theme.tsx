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
  const onChangeCollectionName = useCallback((params: { value: string }) => {
    // @TODO:
  }, [])

  const onCloneCollection = useCallback(() => {
    // @TODO:
  }, [])

  const onRemoveCollection = useCallback(() => {
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
    <div key={row.key} style={row.style} className="theme">
      <Input
        onChange={onChangeCollectionName}
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

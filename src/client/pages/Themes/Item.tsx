import { ListRowProps } from "react-virtualized"
import React from "react"

import { RawPaintStyle, RawTextStyle, StyleType } from "models"
import { Icons, Input, PaintPreview } from "client/components"
import objectSwitch from "utils/objectSwitch"
import * as api from "client/api"

interface IProps {
  row: ListRowProps

  item: {
    type: "STYLE_ITEM"
    style: RawPaintStyle | RawTextStyle
    theme: string
    group: string
    id: string
  }
}

export function Item({ item, row }: IProps) {
  const { style } = item

  const onSelectAllNodesWithStyle = React.useCallback(() => {
    if (!style.base.id.includes("$temp")) {
      api.selectAllFramesByStyle(style.base.id)
    }
  }, [])

  const onOpenEditor = React.useCallback(() => {
    // @TODO
  }, [style])

  const onRemoveStyle = React.useCallback(() => {
    // @TODO
  }, [style])

  const onChange = React.useCallback((params: { value: string }) => {
    // @TODO
  }, [style])

  const preview = objectSwitch(style.inner.type, {
    [StyleType.PAINT]: (
      <PaintPreview
        paints={(style.inner.properties as any).paints}
        onDoubleClick={onSelectAllNodesWithStyle}
      />
    ),
    [StyleType.TEXT]: (
      <div className="text preview">
        <span>T</span>
      </div>
    ),
  })

  return (
    <div key={row.key} style={row.style} className="item">
      <div className="title">
        {preview}

        <div className="name">
          <Input
            value={style.base.styleName}
            validator={/^[a-zA-Z]+$/g}
            onChange={onChange}
            name="style"
          />
        </div>
      </div>

      <div className="actions">
        <div className="action" onClick={onRemoveStyle}>
          <Icons.Trash color="#f44336" size={16} />
        </div>
        <div className="action" onClick={onOpenEditor}>
          <Icons.Edit color="#000000" size={16} />
        </div>
      </div>
    </div>
  )
}

import { ListRowProps } from "react-virtualized"
import React, { useCallback } from "react"
import { useDispatch } from "react-redux"

import { removeStyle, renameStyle, setEditableStyle } from "client/features/themes"
import { Icons, Input, PaintPreview, TextPreview } from "client/components"
import { RawPaintStyle, RawTextStyle, StyleType } from "models"
import objectSwitch from "utils/objectSwitch"
import * as api from "client/api"

interface IProps {
  row: ListRowProps

  item: {
    style: RawPaintStyle | RawTextStyle
    styleType: StyleType
    type: "STYLE_ITEM"
    theme?: string
    group: string
    id: string
  }
}

export function Item({ item, row }: IProps) {
  const dispatch = useDispatch()
  const { style } = item
  const { inner } = style as any

  const onClickPreview = useCallback(() => {
    if (!style.base.id.includes("$temp")) {
      api.selectAllFramesByStyle(style.base.id)
    }
  }, [])

  const onOpenEditor = useCallback(() => {
    dispatch(setEditableStyle(item.style as any))
  }, [item])

  const onRemoveStyle = useCallback(() => {
    dispatch(
      removeStyle({
        collection: item.theme ? item.theme : item.group,
        type: item.styleType,
        id: style.base.id,
      }),
    )
  }, [item, style])

  const onChangeName = useCallback(
    (params: { value: string }) => {
      dispatch(
        renameStyle({
          collection: item.theme ? item.theme : item.group,
          type: item.styleType,
          id: item.id,
          names: {
            name: params.value,
          },
        }),
      )
    },
    [item],
  )

  const preview = objectSwitch(style.inner.type, {
    [StyleType.PAINT]: <PaintPreview paints={inner.properties.paints} onDoubleClick={onClickPreview} />,
    [StyleType.TEXT]: <TextPreview />,
  })

  return (
    <div key={row.key} style={row.style} className="item style">
      <div className="title">
        {preview}

        <div className="name">
          <Input value={style.base.name} validator={/^[a-zA-Z]+$/g} onChange={onChangeName} name="style" />
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

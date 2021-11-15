import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { RawPaintStyle } from "models"

import { addPaintStyle } from "client/features/themes"
import { PaintItem } from "./PaintItem"

interface IProps {
  style: RawPaintStyle
}

export function PaintEditor({ style }: IProps) {
  // prettier-ignore
  const { base, inner: { properties: { paints } } } = style
  const dispatch = useDispatch()

  const onAddPaint = useCallback(() => {
    dispatch(
      addPaintStyle({
        collection: base.theme ? base.theme : base.group,
        id: base.id,
      }),
    )
  }, [])

  // prettier-ignore
  const items = paints.map((paint, index) => (
    <PaintItem
      key={`${paint.type}-${index}`}
      paint={paint}
      index={index}
      style={base}
    />
  ))

  return (
    <div className="paint-editor">
      <div className="items">{items}</div>

      <div className="button add" onClick={onAddPaint}>
        Add Paint
      </div>
    </div>
  )
}

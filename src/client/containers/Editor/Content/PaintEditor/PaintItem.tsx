import React, { useCallback } from "react"
import { useDispatch } from "react-redux"

import { removePaintStyle, updatePaintStyle } from "client/features/themes"
import { Icons, PaintPreview, SelectPopup } from "client/components"
import { BaseProperties } from "models"

import { createDraftPaint } from "utils/style/paints"
import { GradientItem } from "./Gradient"
import { SolidItem } from "./Solid"

interface IProps {
  style: BaseProperties
  index: number
  paint: Paint
}

const types = {
  GRADIENT_LINEAR: "Linear Gradient",
  SOLID: "Color",
}

export function PaintItem({ style, index, paint }: IProps) {
  const dispatch = useDispatch()

  const onRemovePaint = useCallback(() => {
    dispatch(
      removePaintStyle({
        collection: style.theme ? style.theme : style.group,
        id: style.id,
        index,
      }),
    )
  }, [index, style, paint])

  const onChangePaint = useCallback(
    (updated: Paint) => {
      dispatch(
        updatePaintStyle({
          collection: style.theme ? style.theme : style.group,
          paint: updated,
          id: style.id,
          index,
        }),
      )
    },
    [style, index],
  )

  const onChangePaintType = React.useCallback(
    (paintType: "SOLID" | "GRADIENT_LINEAR") => () => {
      const paint = createDraftPaint(paintType)

      dispatch(
        updatePaintStyle({
          collection: style.theme ? style.theme : style.group,
          id: style.id,
          paint,
          index,
        }),
      )
    },
    [style, index],
  )

  let form

  if (paint.type === "SOLID") {
    form = <SolidItem paint={paint as SolidPaint} onChange={onChangePaint} />
  } else if (paint.type.includes("GRADIENT")) {
    form = <GradientItem paint={paint as GradientPaint} onChange={onChangePaint} />
  }

  return (
    <div className="paint">
      <div className="header">
        <PaintPreview paints={[paint]} />

        <SelectPopup
          title={types[paint.type] || paint.type}
          triggerClassName="switch"
          iconSize={11}
          icon="Caret"
          items={[
            { title: "Linear Gradient", onClick: onChangePaintType("GRADIENT_LINEAR") },
            { title: "Color", onClick: onChangePaintType("SOLID") },
          ]}
        />

        <div className="remove" onClick={onRemovePaint}>
          <Icons.Trash color="#f44336" size={16} />
        </div>
      </div>

      {form}
    </div>
  )
}

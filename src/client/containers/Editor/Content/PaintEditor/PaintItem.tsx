import React, { useCallback } from "react"
import { useDispatch } from "react-redux"

import { removePaintStyle, updatePaintStyle } from "client/features/themes"
import { Icons } from "client/components"
import { BaseProperties } from "models"

import { GradientItem } from "./Gradient"
import { SolidItem } from "./Solid"

interface IProps {
  style: BaseProperties
  index: number
  paint: Paint
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

  const onChangeSolid = useCallback(
    (updated: SolidPaint) => {
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

  const onChangeGradient = useCallback(() => {
    // @TODO
  }, [style, index, paint])

  let form

  if (paint.type === "SOLID") {
    form = <SolidItem paint={paint as SolidPaint} onChange={onChangeSolid} />
  } else if (paint.type.includes("GRADIENT")) {
    form = <GradientItem paint={paint as GradientPaint} onChange={onChangeGradient} />
  }

  return (
    <div className="paint">
      <div className="button remove" onClick={onRemovePaint}>
        <Icons.Trash color="#F44336" size={15} />
      </div>

      {form}
    </div>
  )
}

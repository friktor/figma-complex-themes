import { omit } from "utils/helpers"

import { BaseProperties, DeepMutable, InnerProperties, RawPaintStyle, RawTextStyle, StyleType } from "models"
import * as styleNames from "./names"
import * as paints from "./paints"

export const createDraftStyle = (
  theme?: string,
  group?: string,
  name?: string,

  styleType: StyleType = StyleType.PAINT,
): RawPaintStyle | RawTextStyle => {
  const fullname = styleNames.generate(theme, group, name)
  const names = styleNames.parse(fullname)

  const id = `$temp:${Math.random().toString(16).slice(2)}`

  const base: BaseProperties = {
    isDirty: true,
    isDraft: true,
    fullname,
    id,
    ...names,
  }

  let inner: InnerProperties

  if (styleType === StyleType.PAINT) {
    inner = {
      type: StyleType.PAINT,
      properties: {
        paints: [paints.createSolidPaint()],
      },
    }
  } else {
    inner = {
      type: StyleType.TEXT,
      properties: paints.createTextProperties(),
    }
  }

  return {
    inner,
    base,
  } as any
}

export const createStyleFromRaw = (
  style: DeepMutable<PaintStyle | TextStyle>,
): RawPaintStyle | RawTextStyle => {
  const names = styleNames.parse(style.name)

  const base: BaseProperties = {
    isDirty: false,
    isDraft: false,

    fullname: style.name,
    id: style.id,
    ...names,
  }

  let inner: InnerProperties
  if (style.type === "PAINT") {
    inner = {
      properties: { paints: style.paints },
      type: StyleType.PAINT,
    }
  } else {
    inner = {
      type: StyleType.TEXT,
      properties: omit(style, ["id", "name", "description", "type", "remove"]),
    }
  }

  return {
    inner,
    base,
  } as any
}

import { omit } from "utils/helpers"

import { BaseProperties, DeepMutable, InnerProperties, RawPaintStyle, RawTextStyle, StyleType } from "models"
import * as styleNames from "./names"
import * as paints from "./paints"

export const createDraftStyle = (
  collection?: string,
  groupName?: string,
  styleName?: string,

  styleType: StyleType = StyleType.PAINT,
): RawPaintStyle | RawTextStyle => {
  const name = styleNames.generate(collection, groupName, styleName)
  const names = styleNames.parse(name)

  const id = `$temp:${Math.random().toString(16).slice(2)}`

  const base: BaseProperties = {
    isDirty: true,
    isDraft: true,
    name,
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
  style: DeepMutable<PaintStyle> | DeepMutable<TextStyle>,
): RawPaintStyle | RawTextStyle => {
  const names = styleNames.parse(style.name)

  const base: BaseProperties = {
    isDirty: false,
    isDraft: false,

    name: style.name,
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

import chroma from "chroma-js"

import { createGradientLinear, createSolidPaint } from "utils/style/paints"
import { reduceObject, flattenDeep, isPlainObject } from "utils/helpers"
import { createDraftStyle, styleNames } from "utils/style"
import { parseGradient } from "utils/parser"

import {
  RawDeserializedStyle,
  SerializedPaintStyle,
  SerializedTextStyle,
  DeserializedStyles,
  SerializedTheme,
  InnerProperties,
  SerializedGroup,
  RawPaintStyle,
  RawTextStyle,
  StyleType,
  SerializedCollection,
} from "models"

export const deserializeToRawStyles = (themes: SerializedTheme) => {
  const _reducerValue =
    (theme?: string, group?: string) =>
    (out: RawDeserializedStyle[], style: SerializedPaintStyle | SerializedTextStyle, name: string) => {
      const raw: RawDeserializedStyle = {
        fullname: styleNames.generate(theme, group, name),
        style,
        theme,
        group,
        name,
      }

      out.push(raw)
      return out
    }

  const _reducerGroup =
    (theme?: string) =>
    (
      out: RawDeserializedStyle[][],
      groups: Record<string, SerializedPaintStyle | SerializedTextStyle>,
      group: string,
    ) => {
      const reducer = _reducerValue(theme, group)
      const raws = reduceObject(groups, reducer, [])

      out.push(raws)
      return out
    }

  const _reducerGroups =
    (theme?: string) => (out: RawDeserializedStyle[][], groupMap: SerializedGroup, group: string) => {
      const reducer = _reducerValue(theme, group)
      const paints = reduceObject(groupMap.paint, reducer, [])
      const texts = reduceObject(groupMap.text, reducer, [])
      const raws = [...paints, ...texts]

      out.push(raws)
      return out
    }

  const _reducerThemes = (out: RawDeserializedStyle[][][], themeMap: SerializedCollection, theme: string) => {
    const reducer = _reducerGroup(theme)
    const paints = reduceObject(themeMap.paint, reducer, [])
    const texts = reduceObject(themeMap.text, reducer, [])
    const raws = [...paints, ...texts]

    out.push(raws)
    return out
  }

  return [
    ...flattenDeep(reduceObject(themes.theme, _reducerThemes, [])),
    ...flattenDeep(reduceObject(themes.group, _reducerGroups(), [])),
  ]
}

export const rawDeserializedToStyle = (raw: RawDeserializedStyle): RawPaintStyle | RawTextStyle => {
  const style = createDraftStyle(raw.theme, raw.group, raw.name)

  if (isPlainObject(raw.style)) {
    const inner: InnerProperties = {
      type: StyleType.TEXT,
      properties: {
        ...(raw.style as any),
      },
    }

    style.inner = inner
  } else {
    let _paints: string[]
    if (typeof raw.style === "string") {
      _paints = [raw.style]
    } else {
      _paints = raw.style as string[]
    }

    const paints = _paints
      .map(_paint => {
        if (chroma.valid(_paint)) {
          const solid = createSolidPaint(_paint)
          return solid
        } else {
          /* eslint-disable-next-line */
          const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/
          const _match = rGradientEnclosedInBrackets.exec(_paint)

          if (_match) {
            const _gradient = parseGradient(_match[1])

            if (_gradient) {
              const gradient = createGradientLinear(_gradient.angle.degrees, _gradient.colorStopList)

              return gradient
            }
          }
        }
      })
      .filter(s => !!s)

    ;(style.inner.properties as any).paints = paints
  }

  return style
}

export const deserialize = (theme: SerializedTheme): DeserializedStyles => {
  const output: DeserializedStyles = {
    paint: [],
    text: [],
  }

  const deserializeRawStyles = deserializeToRawStyles(theme)

  deserializeRawStyles.forEach(raw => {
    const style = rawDeserializedToStyle(raw)

    if (style.inner.type === "PAINT") {
      output.paint.push(style as any)
    } else {
      output.text.push(style as any)
    }
  })

  return output
}

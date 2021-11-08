import { styleNames, paints } from "utils/style"
import objectSwitch from "utils/objectSwitch"
import { pick } from "utils/helpers"

import {
  SerializedPaintStyle,
  SerializedUnionType,
  SerializedThemeFull,
  SerializedTextStyle,
  SerializedTheme,
  StyleType,
} from "models"

export const serializeStyle = (style: PaintStyle | TextStyle): SerializedTextStyle | SerializedPaintStyle => {
  if (style.type === StyleType.PAINT) {
    const _paints = style.paints
      .map(paint =>
        objectSwitch(paint.type, {
          SOLID: () => paints.paintToCss.solid(paint as any),
          GRADIENT_LINEAR: () =>
            paints.paintToCss.gradient((paint as any).gradientTransform, (paint as any).gradientStops),
        })(),
      )
      .filter(i => !!i)

    if (_paints.length === 1) {
      return _paints[0]
    } else {
      return _paints
    }
  } else {
    const textProperties = pick(style, [
      "paragraphSpacing",
      "paragraphIndent",
      "textDecoration",
      "letterSpacing",
      "lineHeight",
      "textCase",
      "fontName",
      "fontSize",
    ])

    return textProperties
  }
}

interface IntoSerializeStyles {
  paint: PaintStyle[]
  text: TextStyle[]
}

export const serialize = (
  name: string,
  styles: IntoSerializeStyles,
  disableSerializeStyle = false, // output style values is full figma style
): SerializedTheme | SerializedThemeFull => {
  const output = {
    theme: {},
    group: {},
    name,
  }

  const _insertTheme = (theme: string) => {
    if (!output.theme[theme]) {
      output.theme[theme] = {
        type: SerializedUnionType.Theme,
        paint: {},
        text: {},
      }
    }
  }

  const _insertGroup = (group: string, type: StyleType, theme?: string) => {
    if (theme) {
      if (!output.theme[theme][type.toLowerCase()][group]) {
        output.theme[theme][type.toLowerCase()][group] = {}
      }
    } else {
      if (!output.group[group]) {
        output.group[group] = {
          type: SerializedUnionType.Group,
          paint: {},
          text: {},
        }
      }
    }
  }

  const _insertStyle = (
    style: SerializedTextStyle | SerializedPaintStyle | TextStyle | PaintStyle,

    group: string,
    name: string,
    type: StyleType,
    theme?: string,
  ) => {
    if (theme) {
      output.theme[theme][type.toLowerCase()][group][name] = style
    } else {
      output.group[group][type.toLowerCase()][name] = style
    }
  }

  const _iterator = (style: PaintStyle | TextStyle) => {
    const names = styleNames.parse(style.name)

    if (names.theme) {
      _insertTheme(names.theme)
      _insertGroup(names.group, style.type as StyleType, names.theme)

      let serializedStyle: SerializedTextStyle | SerializedPaintStyle | PaintStyle | TextStyle

      if (disableSerializeStyle) {
        serializedStyle = style
      } else {
        serializedStyle = serializeStyle(style)
      }

      _insertStyle(serializedStyle, names.group, names.name, style.type as StyleType, names.theme)
    } else if (names.group) {
      _insertGroup(names.group, style.type as StyleType)

      let serializedStyle: SerializedTextStyle | SerializedPaintStyle | PaintStyle | TextStyle

      if (disableSerializeStyle) {
        serializedStyle = style
      } else {
        serializedStyle = serializeStyle(style)
      }

      _insertStyle(serializedStyle, names.group, names.name, style.type as StyleType)
    }
  }

  styles.paint.forEach(_iterator)
  styles.text.forEach(_iterator)

  return output
}

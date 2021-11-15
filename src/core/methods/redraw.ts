import { RedrawOptions, SerializedThemeFull } from "models"
import { getRawStyles } from "./queries"
import { styleNames } from "utils/style"
import { serialize } from "utils/serde"
import { get } from "utils/helpers"

export const redrawFrame = async (options: RedrawOptions) => {
  const { paintStyles: paint, textStyles: text } = await getRawStyles()
  const serialized = serialize("redraw", { paint, text } as any, true) as SerializedThemeFull
  const targetTheme = serialized.theme[options.targetThemeCollection]

  if (!targetTheme) {
    console.warn(`Theme '${options.targetThemeCollection}' not exists`)
    return
  }

  const getTargetPaintStyle = (styleId: string): undefined | string => {
    const style = figma.getStyleById(styleId)

    if (style && style.type === "PAINT") {
      const names = styleNames.parse(style.name)

      if (names.theme && names.group && names.name) {
        const targetStyleId = get(targetTheme.paint, [names.group, names.name, "id"].join("."))
        return targetStyleId
      }
    }

    return undefined
  }

  const getTargetTextStyle = (styleId: string): undefined | string => {
    const style = figma.getStyleById(styleId)

    if (style && style.type === "TEXT") {
      const names = styleNames.parse(style.name)

      if (names.theme && names.group && names.name) {
        const targetStyleId = get(targetTheme.text, [names.group, names.name, "id"].join("."))
        return targetStyleId
      }
    }

    return undefined
  }

  const redrawNode = (node: any) => {
    if (node.fillStyleId) {
      const targetFillId = getTargetPaintStyle(node.fillStyleId)

      if (targetFillId) {
        node.fillStyleId = targetFillId
      }
    }

    if (node.strokeStyleId) {
      const targetStrokeId = getTargetPaintStyle(node.strokeStyleId)

      if (targetStrokeId) {
        node.strokeStyleId = targetStrokeId
      }
    }

    if (node.textStyleId) {
      const targetTextStyleId = getTargetTextStyle(node.textStyleId)

      if (targetTextStyleId) {
        node.textStyleId = targetTextStyleId
      }
    }
  }

  const _iterator = (node: any) => {
    redrawNode(node)

    if (node.children && node.children.length > 0) {
      node.children.forEach(_iterator)
    }
  }

  try {
    const targetNode = figma.getNodeById(options.sourceFrameId)
    _iterator(targetNode)
  } catch (error) {
    console.error(error)
  }
}

import each from "lodash-es/each"
import get from "lodash-es/get"

import { RedrawOptions, SerializedThemeFull } from "models"
import { getRawStyles } from "./queries"
import { styleNames } from "utils/style"
import { serialize } from "utils/serde"

export const redrawFrame = async (options: RedrawOptions) => {
    const { paintStyles: paint, textStyles: text } = await getRawStyles()
    const serialized = serialize("redraw", { paint, text } as any, true) as SerializedThemeFull
    const targetCollection = serialized.collection[options.targetThemeCollection]
    
    if (!targetCollection) {
        console.warn(`Collection '${options.targetThemeCollection}' not exists`)
        return
    }

    const getTargetPaintStyle = (styleId: string): undefined | string => {
        const style = figma.getStyleById(styleId)

        if (style && style.type === "PAINT") {
            const names = styleNames.parse(style.name)

            if (names.collection && names.groupName && names.styleName) {
                const targetStyleId = get(targetCollection.paint, [ names.groupName, names.styleName, "id" ])
                return targetStyleId
            }
        }

        return undefined
    }

    const getTargetTextStyle = (styleId: string): undefined | string => {
        const style = figma.getStyleById(styleId)

        if (style && style.type === "TEXT") {
            const names = styleNames.parse(style.name)

            if (names.collection && names.groupName && names.styleName) {
                const targetStyleId = get(targetCollection.text, [ names.groupName, names.styleName, "id" ])
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
            each(node.children, _iterator)
        }
    }

    try {
        const targetNode = figma.getNodeById(options.sourceFrameId)
        _iterator(targetNode)
    } catch (error) {
        console.error(error)
    }
}

import { ImportStylesOptions, RawPaintStyle } from "models"
import { processPaintStyle } from "./processing"
import { createDraftStyle } from "utils/style"
import { cloneDeep, size } from "utils/helpers"
import md5 from "utils/md5"

let stylesByHash: {
    paint: { [hash: string]: string },
    text: { [hash: string]: string },
} = {
    paint: {},
    text: {},
}

const getPaintStyleId = async (_paints: Paint[]): Promise<string> => {
    const paints = cloneDeep(_paints)
    const hash = md5(JSON.stringify(paints))

    if (!stylesByHash.paint[hash]) {
        const styleName = `Untitled-${size(stylesByHash.paint)}`
        const draft = createDraftStyle("Default", "Imported", styleName) as RawPaintStyle
        
        draft.inner.properties.paints = paints

        const style = await processPaintStyle(draft)
        const { id: styleId } = style.base

        stylesByHash.paint[hash] = styleId
        return styleId
    } else {
        return stylesByHash.paint[hash]
    }
}

const handleNode = async (node: any) => {
    try {
        if (node.fills && size(node.fills) > 0) {
            const id = await getPaintStyleId(node.fills)
            node.fillStyleId = id
        }

        if (node.strokes && size(node.strokes) > 0) {
            const id = await getPaintStyleId(node.strokes)
            node.strokeStyleId = id
        }
    } catch (error) {
        console.error(error)
    }
}

export const importStyleFromNode = async (frameId: string) => {
    const _iterator = async (node: any) => {
        await handleNode(node)

        if (node.children && node.children.length > 0) {
            for await (const children of node.children) {
                await _iterator(children)
            }
        }
    }

    try {
        const targetNode = figma.getNodeById(frameId)
        await _iterator(targetNode)
    } catch (error) {
        console.error(error)
    }
}

export const importStyleFromFrameToTheme = async (options: ImportStylesOptions) => {
    stylesByHash = { text: {}, paint: {} } // Clear

    for await (const id of options.sourceFrameIds) {
        await importStyleFromNode(id)
    }
}

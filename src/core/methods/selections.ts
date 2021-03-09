import map from "lodash-es/map"

import { SelectionEvent } from "models"

const mapSelections = (selections: readonly SceneNode[]): SelectionEvent[] => map(
    selections,
    ({ name, type, id }) => ({ name, type, id })
)

export const getCurrentSelections = async (): Promise<SelectionEvent[]> => mapSelections(
    figma.currentPage.selection,
)

export const addToSelections = async (nodeId: string): Promise<SelectionEvent[]> => {
    const selections = [ ...figma.currentPage.selection ]
    const node: any = figma.getNodeById(nodeId)

    if (node) {
        selections.push(node)
    }

    try {
        figma.currentPage.selection = selections
        return mapSelections(selections)
    } catch (error) {
        return mapSelections(figma.currentPage.selection)
    }
}

export const selectAllFramesByStyle = async (styleId: string): Promise<SelectionEvent[]> => {
    const style = figma.getStyleById(styleId)
    const nodes = []

    const _iterator = (node: any) => {
        if (
            (node.fillStyleId && node.fillStyleId === style.id) ||
            (node.strokeStyleId && node.strokeStyleId === style.id)
        ) {
            nodes.push(node)
        }

        if (node.children && node.children.length > 0) {
            for (const children of node.children) {
                _iterator(children)
            }
        }
    }

    if (style) {
        _iterator(figma.currentPage)
    }

    try {
        figma.currentPage.selection = nodes
    } catch (error) {
        console.error(error)
    }

    return mapSelections(figma.currentPage.selection)
}

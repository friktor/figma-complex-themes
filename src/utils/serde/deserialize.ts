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
    const _reducerValue = (collection?: string, groupName?: string) => (
        out: RawDeserializedStyle[],
        style: SerializedPaintStyle | SerializedTextStyle,
        styleName: string,
    ) => {
        const raw: RawDeserializedStyle = {
            name: styleNames.generate(collection, groupName, styleName),
            collection,
            groupName,
            styleName,
            style,
        }

        out.push(raw)
        return out
    }

    const _reducerGroup = (collection?: string) => (
        out: RawDeserializedStyle[][],
        groups: Record<string, SerializedPaintStyle | SerializedTextStyle>,
        groupName: string,
    ) => { 
        const reducer = _reducerValue(collection, groupName)
        const raws = reduceObject(groups, reducer, [])

        out.push(raws)
        return out
    }

    const _reducerGroups = (collection?: string) => (
        out: RawDeserializedStyle[][],
        group: SerializedGroup,
        groupName: string,
    ) => {
        const reducer = _reducerValue(collection, groupName)
        const paints = reduceObject(group.paint, reducer, [])
        const texts = reduceObject(group.text, reducer, [])
        const raws = [ ...paints, ...texts ]

        out.push(raws)
        return out
    }

    const _reducerCollections = (
        out: RawDeserializedStyle[][][],
        collection: SerializedCollection,
        collectionName: string,
    ) => {
        const reducer = _reducerGroup(collectionName)
        const paints = reduceObject(collection.paint, reducer, [])
        const texts = reduceObject(collection.text, reducer, [])
        const raws = [ ...paints, ...texts ]

        out.push(raws)
        return out
    }

    return [
        ...flattenDeep(reduceObject(themes.collection, _reducerCollections, [])),
        ...flattenDeep(reduceObject(themes.group, _reducerGroups(), [])),
    ]
}

export const rawDeserializedToStyle = (raw: RawDeserializedStyle): RawPaintStyle | RawTextStyle => {
    const style = createDraftStyle(raw.collection, raw.groupName, raw.styleName)

    if (isPlainObject(raw.style)) {
        const inner: InnerProperties = {
            type: StyleType.TEXT,
            properties: {
                ...raw.style as any,
            }
        }

        style.inner = inner
    } else {
        let _paints: string[]
        if (typeof(raw.style) === "string") {
            _paints = [ raw.style ]
        } else {
            _paints = raw.style as string[]
        }

        const paints = _paints.map((_paint) => {
            if (chroma.valid(_paint)) {
                const solid = createSolidPaint(_paint)
                return solid
            } else {
                const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/
                const _match = rGradientEnclosedInBrackets.exec(_paint)

                if (_match) {
                    const _gradient = parseGradient(_match[1])
                    
                    if (_gradient) {
                        const gradient = createGradientLinear(
                            _gradient.angle.degrees,
                            _gradient.colorStopList,
                        )
    
                        return gradient
                    }
                }
            }
        }).filter((s) => !!s)

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
    
    deserializeRawStyles.forEach((raw) => {
        const style = rawDeserializedToStyle(raw)

        if (style.inner.type === "PAINT") {
            output.paint.push(style as any)
        } else {
            output.text.push(style as any)
        }
    })

    console.log(output)
    return output
}

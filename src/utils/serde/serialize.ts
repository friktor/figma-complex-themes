import pick from "lodash-es/pick"
import each from "lodash-es/each"
import map from "lodash-es/map"

import { styleNames, paints } from "utils/style"
import objectSwitch from "utils/objectSwitch"

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
        const _paints = map(
            style.paints, (paint) => objectSwitch(paint.type, {
                SOLID: () => paints.paintToCss.solid(paint as any),
                GRADIENT_LINEAR: () => paints.paintToCss.gradient(
                    (paint as any).gradientTransform,
                    (paint as any).gradientStops
                ),
            })()
        ).filter((i) => !!i)

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
    paint: PaintStyle[],
    text: TextStyle[],
}

export const serialize = (
    name: string,
    styles: IntoSerializeStyles,
    disableSerializeStyle = false, // output style values is full figma style
): SerializedTheme | SerializedThemeFull => {
    const output = {
        collection: {},
        group: {},
        name,
    }

    const _insertCollection = (collection: string) => {
        if (!output.collection[collection]) {
            output.collection[collection] = {
                type: SerializedUnionType.Collection,
                paint: {},
                text: {},
            }
        }
    }

    const _insertGroup = (
        groupName: string,
        styleType: StyleType,
        collection?: string,
    ) => {
        if (collection) {
            if (!output.collection[collection][styleType.toLowerCase()][groupName]) {
                output.collection[collection][styleType.toLowerCase()][groupName] = {}
            }
        } else {
            if (!output.group[groupName]) {
                output.group[groupName] = {
                    type: SerializedUnionType.Group,
                    paint: {},
                    text: {},
                }
            }
        }
    }

    const _insertStyle = (
        style: SerializedTextStyle | SerializedPaintStyle | TextStyle | PaintStyle,

        groupName: string,
        styleName: string,
        styleType: StyleType,
        collection?: string
    ) => {
        if (collection) {
            output.collection[collection][styleType.toLowerCase()][groupName][styleName] = style
        } else {
            output.group[groupName][styleType.toLowerCase()][styleName] = style
        }
    }

    const _iterator = (style: PaintStyle | TextStyle) => {
        const names = styleNames.parse(style.name)

        if (names.collection) {
            _insertCollection(names.collection)
            
            _insertGroup(
                names.groupName,
                style.type as StyleType,
                names.collection,
            )
            
            let serializedStyle: SerializedTextStyle | SerializedPaintStyle | PaintStyle | TextStyle
            
            if (disableSerializeStyle) {
                serializedStyle = style
            } else {
                serializedStyle = serializeStyle(style)
            }
            
            _insertStyle(
                serializedStyle,
                names.groupName,
                names.styleName,
                style.type as StyleType,
                names.collection,
            )
        } else if (names.groupName) {
            _insertGroup(
                names.groupName,
                style.type as StyleType,
            )
            
            let serializedStyle: SerializedTextStyle | SerializedPaintStyle | PaintStyle | TextStyle
            
            if (disableSerializeStyle) {
                serializedStyle = style
            } else {
                serializedStyle = serializeStyle(style)
            }
            
            _insertStyle(
                serializedStyle,
                names.groupName,
                names.styleName,
                style.type as StyleType,
            )
        }
    }

    each(styles.paint, _iterator)
    each(styles.text, _iterator)

    return output
}

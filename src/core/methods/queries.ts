import pick from "lodash-es/pick"
import map from "lodash-es/map"

interface RawStyles {
    paintStyles: PaintStyle[],
    textStyles: TextStyle[],
}

export const getRawStyles = async (): Promise<RawStyles> => {
    const paintStyles = map(
        figma.getLocalPaintStyles(),
        (s) => pick(s, [
            "paints",
            "type",
            "name",
            "id",
        ]),
    )
    
    const textStyles = map(
        figma.getLocalTextStyles(),
        
        (s) => pick(s, [
            "paragraphSpacing",
            "paragraphIndent",
            "textDecoration",
            "letterSpacing",
            "lineHeight",
            "textCase",
            "fontName",
            "fontSize",
            "type",
            "name",
            "id",
        ]),
    )

    return {
        paintStyles,
        textStyles,
    } as any
}

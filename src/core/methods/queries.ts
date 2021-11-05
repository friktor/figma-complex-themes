import { pick } from "utils/helpers"

interface RawStyles {
    paintStyles: PaintStyle[],
    textStyles: TextStyle[],
}

export const getRawStyles = async (): Promise<RawStyles> => {
    const paintStyles = figma.getLocalPaintStyles().map(
        (s) => pick(s, [
            "paints",
            "type",
            "name",
            "id",
        ]),
    )
    
    const textStyles = figma.getLocalTextStyles().map(        
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

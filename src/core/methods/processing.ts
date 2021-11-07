// CRUD operations for paint & text styles
import { RawPaintStyle, RawStyle, RawTextStyle } from "models"
import objectSwitch from "utils/objectSwitch"

export const processPaintStyle = async (style: RawPaintStyle): Promise<RawStyle> => {
  const { base, inner } = style
  const { id, name } = base

  const isDraft = id.includes("$temp")
  let paintStyle: PaintStyle

  // If founded exists style by unique name from drafted - replace it
  if (isDraft) {        
    const styleByName = figma.getLocalPaintStyles().find(style => style.name === name)

    if (styleByName) {
      paintStyle = styleByName
    } else {
      paintStyle = figma.createPaintStyle()
    }
  } else {
    paintStyle = figma.getStyleById(id) as any
  }

  paintStyle.name = name
  paintStyle.paints = inner.properties.paints

  return Object.assign(style, { base: Object.assign(base, {
    id: paintStyle.id,

    isDraft: false,
    isDirty: false,
  }, (paintStyle.id !== id) && {
    draftId: id,
  }) })
}

// @TODO: need correct text styles settes with loaded styles
export const processTextStyle = async (style: RawTextStyle): Promise<RawStyle> => {
  const { base, inner } = style
  const { id, name } = base

  const isDraft = id.includes("$temp")
  let textStyle: TextStyle

  // If founded exists style by unique name from drafted - replace it
  if (isDraft) {        
    const styleByName = figma.getLocalTextStyles().find(style => style.name === name)

    if (styleByName) {
      textStyle = styleByName
    } else {
      textStyle = figma.createTextStyle()
    }
  } else {
    textStyle = figma.getStyleById(id) as any
  }

  textStyle.name = style.base.name

  await figma.loadFontAsync(style.inner.properties.fontName)

  try {
    textStyle.fontName = style.inner.properties.fontName
    textStyle.textCase = style.inner.properties.textCase
    textStyle.fontSize = style.inner.properties.fontSize
    textStyle.lineHeight = style.inner.properties.lineHeight
        
    textStyle.paragraphSpacing = style.inner.properties.paragraphSpacing
    textStyle.paragraphIndent = style.inner.properties.paragraphIndent
    textStyle.textDecoration = style.inner.properties.textDecoration
    textStyle.letterSpacing = style.inner.properties.letterSpacing
  } catch (error) {
    console.error(error)
  }

  return Object.assign(style, { base: Object.assign(base, {
    id: textStyle.id,

    isDraft: false,
    isDirty: false,
  }, (textStyle.id !== id) && {
    draftId: id,
  }) })
}

export const processStyle = async (style: RawStyle): Promise<RawStyle> => {
  const _method: any = objectSwitch(style.inner.type, {
    PAINT: processPaintStyle,
    TEXT: processTextStyle,
  })

  try {
    const processed = await _method(style)
    return processed
  } catch (error) {
    console.log("Process style error:", style)
    console.error(error)
    throw error
  }
}

export const processStyles = async (styles: RawStyle[]) => {
  const futures = styles.map(style => processStyle(style))
  const processed = await Promise.all(futures)
  return processed
}

export const removeStyle = async (styleId: string) => {
  const style = figma.getStyleById(styleId)
    
  if (style) {
    style.remove()
  }
}

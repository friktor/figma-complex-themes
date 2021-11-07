export enum StyleType {
  PAINT = "PAINT",
  TEXT = "TEXT",
}

export interface BaseProperties {
  isDirty: boolean // flag marked updated style and not synchronized with main layer
  isDraft: boolean // flag for new style not created on figma main layer

  name: string // original fullname of style
  id: string // unique id of style

  collection?: string // collection name of have
  groupName?: string // group of collection, or common group name
  styleName: string // extracted style name
}

export interface PaintProperties {
  paints: Array<Paint>
}

export type TextProperties = Pick<
  TextStyle,
  | "paragraphSpacing"
  | "paragraphIndent"
  | "textDecoration"
  | "letterSpacing"
  | "lineHeight"
  | "textCase"
  | "fontName"
  | "fontSize"
>

export type InnerProperties =
  | {
      type: StyleType.PAINT
      properties: PaintProperties
    }
  | {
      type: StyleType.TEXT
      properties: TextProperties
    }

export interface RawStyle {
  inner: InnerProperties
  base: BaseProperties
}

export interface RawPaintStyle extends RawStyle {
  inner: {
    properties: PaintProperties
    type: StyleType.PAINT
  }
}

export interface RawTextStyle extends RawStyle {
  inner: {
    properties: TextProperties
    type: StyleType.TEXT
  }
}

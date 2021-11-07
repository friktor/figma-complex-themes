import { RawPaintStyle, RawTextStyle } from "./style"

export type SerializedTextStyle = Pick<
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

// e.g <color | color[] | (color | css gradient)[]>
export type SerializedPaintStyle = string | string[]

export enum SerializedUnionType {
  Collection = "collection",
  Group = "group",
}

export interface SerializedUnion<T, PD, TD> {
  paint: PD
  text: TD
  type: T
}

export type SerializedGroup<PD = SerializedPaintStyle, TD = SerializedTextStyle> = SerializedUnion<
  SerializedUnionType.Group,
  Record<string, PD>,
  Record<string, TD>
>

export type SerializedCollection<PD = SerializedPaintStyle, TD = SerializedTextStyle> = SerializedUnion<
  SerializedUnionType.Collection,
  Record<string, Record<string, PD>>,
  Record<string, Record<string, TD>>
>

export interface SerializedTheme {
  name: string

  collection: Record<string, SerializedCollection>
  group: Record<string, SerializedGroup>
}

export interface SerializedThemeFull {
  name: string

  collection: Record<string, SerializedCollection<PaintStyle, TextStyle>>
  group: Record<string, SerializedGroup<PaintStyle, TextStyle>>
}

export interface RawDeserializedStyle {
  style: SerializedPaintStyle | SerializedTextStyle
  collection?: string
  groupName: string
  styleName: string
  name: string
}

export interface DeserializedStyles {
  paint: RawPaintStyle[]
  text: RawTextStyle[]
}

export interface Library {
  [name: string]: SerializedTheme
}
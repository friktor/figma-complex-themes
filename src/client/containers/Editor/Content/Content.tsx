import React from "react"

import objectSwitch from "utils/objectSwitch"
import { RawStyle, StyleType } from "models"
import { PaintEditor } from "./PaintEditor"
import { TextEditor } from "./TextEditor"

interface IProps {
  style: RawStyle
}

export function Content({ style }: IProps) {
  const { inner } = style as any

  const content = objectSwitch(
    inner.type,
    {
      [StyleType.PAINT]: () => <PaintEditor style={style as any} />,
      [StyleType.TEXT]: () => <TextEditor style={style as any} />,
    },
    true,
  )

  return <div className="content">{content}</div>
}

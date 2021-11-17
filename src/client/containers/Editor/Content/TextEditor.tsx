import React, { useCallback, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { RawTextStyle } from "models"

interface IProps {
  style: RawTextStyle
}

export function TextEditor({ style }: IProps) {
  const dispatch = useDispatch()
  const { inner } = style

  return (
    <div className="text-editor">
      <div className="title">At now, text editor not support</div>
    </div>
  )
}

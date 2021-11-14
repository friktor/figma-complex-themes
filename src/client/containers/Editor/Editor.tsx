import { useDispatch, useSelector } from "react-redux"
import React, { useCallback } from "react"

import { setEditableStyle } from "client/features/themes"
import { getEditableStyle } from "client/selectors"
import { Content } from "./Content"
import { Header } from "./Header"

interface IProps {}

export function Editor(props: IProps) {
  const style = useSelector(getEditableStyle)
  const dispatch = useDispatch()

  const onClose = useCallback(() => {
    dispatch(setEditableStyle(undefined))
  }, [])

  if (!style) {
    return null
  }

  return (
    <div className="editor-modal">
      <div className="editor-modal-overlay" onClick={onClose} />

      <div className="editor">
        <Header style={style} />
        <Content style={style} />
      </div>
    </div>
  )
}

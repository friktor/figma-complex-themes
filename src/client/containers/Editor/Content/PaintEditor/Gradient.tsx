import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import chroma from "chroma-js"

interface IProps {
  onChange: (paint: GradientPaint) => void,
  paint: GradientPaint
}

export function GradientItem(props: IProps) {
  const dispatch = useDispatch()

  return (
    <div className="gradient-color">

    </div>
  )
}

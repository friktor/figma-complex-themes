import React, { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import cx from "classnames"

import { createGradientLinear, paintToCss } from "utils/style/paints"
import { parseGradient } from "utils/parser"

interface IProps {
  onChange: (paint: GradientPaint) => void
  paint: GradientPaint
}

export function GradientItem(props: IProps) {
  const [expression, setExpression] = useState<string>()
  const [error, setError] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.paint.type !== "GRADIENT_LINEAR") {
      return
    }

    // prettier-ignore
    const expr = paintToCss.gradient(
      props.paint.gradientTransform,
      props.paint.gradientStops as any,
    )

    setExpression(expr)
  }, [props.paint])

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setExpression(value)

    /* eslint-disable-next-line */
    const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/
    const _match = rGradientEnclosedInBrackets.exec(value)

    if (!_match || !parseGradient(_match[1])) {
      setError(true)
    } else {
      setError(false)
    }
  }, [])

  const onBlur = useCallback(() => {
    /* eslint-disable-next-line */
    const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/
    const _match = rGradientEnclosedInBrackets.exec(expression)

    const toOriginal = () => {
      // prettier-ignore
      const expr = paintToCss.gradient(
        props.paint.gradientTransform,
        props.paint.gradientStops as any,
      )

      setExpression(expr)
    }

    if (_match) {
      const _gradient = parseGradient(_match[1])

      if (_gradient) {
        const gradient = createGradientLinear(_gradient.angle.degrees, _gradient.colorStopList)
        props.onChange(gradient)
      } else {
        toOriginal()
      }
    } else {
      toOriginal()
    }
  }, [expression, props.paint])

  if (props.paint.type !== "GRADIENT_LINEAR") {
    return <div className="gradient-color">Only linear gradients are supported</div>
  }

  return (
    <div className="gradient-color">
      <div className={cx("part", { error })}>
        <label htmlFor="hex">CSS</label>
        <input name="hex" type="text" value={expression} onChange={onChange} onBlur={onBlur} />
      </div>
    </div>
  )
}

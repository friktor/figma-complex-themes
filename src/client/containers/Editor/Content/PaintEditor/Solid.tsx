import React, { useCallback, useEffect, useState } from "react"
import chroma from "chroma-js"
import cx from "classnames"

interface IProps {
  onChange: (paint: SolidPaint) => void
  paint: SolidPaint
}

const hexRegex = /^[0-9A-Fa-f]+$/

export function SolidItem(props: IProps) {
  const [rgb, setRgb] = useState<[number, number, number]>([0, 0, 0])
  const [alpha, setAlpha] = useState<number>(1)
  const [hex, setHex] = useState<string>("000")

  const [rgbError, setRgbError] = React.useState<[number, number, number]>([0, 0, 0])
  const [alphaError, setAlphaError] = React.useState<number>(0)
  const [hexError, setHexError] = React.useState<number>(0)

  const getPaintColor = useCallback((paint: SolidPaint) => {
    const { r, g, b } = paint.color
    const color = chroma(r, g, b, "gl")
    return color
  }, [])

  const getPaintFromColor = useCallback(
    (color: chroma.Color) => {
      const [r, g, b] = color.gl()

      const paint: SolidPaint = {
        opacity: parseInt(alpha as any) / 100,
        blendMode: "NORMAL",
        color: { r, g, b },
        type: "SOLID",
      }

      return paint
    },
    [alpha],
  )

  useEffect(() => {
    const color = getPaintColor(props.paint)
    setAlpha(parseInt(((props.paint.opacity || 1) * 100) as any))
    setHex(color.hex().replace("#", ""))

    const rgb = color.rgb()
    setRgb(rgb)
  }, [props.paint])

  const onChangeHex = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = event.target.value.replace("#", "")
    setHex(newHex)

    if (!hexRegex.test(newHex) || !chroma.valid(newHex)) {
      setHexError(1)
    } else {
      setRgb(chroma(newHex).rgb())
      setHexError(undefined)
    }
  }, [])

  const onBlurHex = useCallback(
    event => {
      if (!hexRegex.test(hex) || !chroma.valid(hex)) {
        const color = getPaintColor(props.paint)
        setHexError(undefined)
        setHex(color.hex().replace("#", ""))
      } else {
        const paint = getPaintFromColor(chroma(hex))
        props.onChange(paint)
      }
    },
    [hex, getPaintFromColor],
  )

  const onRgbChange = useCallback(
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      const newRgb: any = [...rgb]
      newRgb[index] = value as any

      setRgb(newRgb)

      const intValue = parseInt(value)
      const isValid = intValue && intValue >= 0 && intValue <= 255

      if (!isValid) {
        const newRgbError: any = new Array(3).fill(0)
        newRgbError[index] = 1
        setRgbError(newRgbError)
      } else {
        setHex(
          chroma(`rgb(${newRgb.join(",")})`)
            .hex()
            .replace("#", ""),
        )

        setRgbError([0, 0, 0])
      }
    },
    [],
  )

  const onBlurRgb = useCallback(
    (index: number) => event => {
      const intValue = parseInt(rgb[index] as any)
      const isValid = intValue && intValue >= 0 && intValue <= 255

      if (!isValid) {
        const color = getPaintColor(props.paint).rgb()
        setRgbError([0, 0, 0])

        rgb[index] = color[index]
        setRgb(rgb)
      } else {
        const paint = getPaintFromColor(chroma(hex))
        props.onChange(paint)
      }
    },
    [hex, getPaintFromColor],
  )

  const onChangeAlpha = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setAlpha(value as any)

    const intValue = parseInt(value)
    const isValid = intValue && intValue >= 0 && intValue <= 100

    if (!isValid) {
      setAlphaError(1)
    } else {
      setAlphaError(undefined)
    }
  }, [])

  const onBlurAlpha = useCallback(
    event => {
      const intValue = parseInt(alpha as any)
      const isValid = intValue && intValue >= 0 && intValue <= 100
      console.log(onBlurAlpha)

      if (!isValid) {
        setAlpha(props.paint.opacity * 100)
        setAlphaError(1)
      } else {
        const paint = getPaintFromColor(chroma(hex))
        props.onChange(paint)
      }
    },
    [alpha, hex, getPaintFromColor],
  )

  const rgbRow = rgb.map((value, index) => {
    const label = ["R", "G", "B"][index]

    return (
      <div key={label} className={cx("part", { error: !!rgbError[index] })}>
        <label htmlFor={label}>{label}</label>
        <input name={label} type="text" value={value} onChange={onRgbChange(index)} onBlur={onBlurRgb(index)} />
      </div>
    )
  })

  return (
    <div className="solid-color">
      <div className="hex">
        <div className={cx("part", { error: hexError })}>
          <label htmlFor="hex">HEX</label>
          <input name="hex" type="text" value={hex} onChange={onChangeHex} onBlur={onBlurHex} />
        </div>

        <div className={cx("part", { error: alphaError })}>
          <label htmlFor="alpha">Alpha</label>
          <input name="alpha" type="number" value={alpha} onChange={onChangeAlpha} onBlur={onBlurAlpha} />
        </div>
      </div>

      <div className="rgba">{rgbRow}</div>
    </div>
  )
}

import React from "react"

interface IProps {
  onDoubleClick?: () => void
  paints: Paint[]
}

export function PaintPreview({ paints, onDoubleClick }: IProps) {
  const layers = paints.map((paint, index) => {
    const rgba = (r, g, b, a) => `rgba(${(r * 255).toFixed(0)}, ${(g * 255).toFixed(0)}, ${(b * 255).toFixed(0)}, ${a})`
    const zIndex = index + 1
    const type = paint.type

    if (type === "SOLID") {
      const { color, opacity } = paint as SolidPaint
      const background = rgba(color.r, color.g, color.b, opacity)

      return <div style={{ background, zIndex }} key={`preview-layer-${index}`} className="layer" />
    } else if (type === "GRADIENT_LINEAR") {
      const { gradientStops, gradientTransform } = paint as GradientPaint

      // [[cos(angle), sin(angle), 0],
      // [-sin(angle), cos(angle), 0]]

      // crutch without offset support
      const angle = Math.asin(gradientTransform[0][1]) * (180 / Math.PI) + 90

      const stops = gradientStops.map(stop => {
        const { color: _color } = stop

        const color = rgba(_color.r, _color.g, _color.b, _color.a)
        const position = (stop.position * 100).toFixed(0)
        return `${color} ${position}%`
      })

      const background = `linear-gradient(${angle.toFixed(0)}deg, ${stops.join(",")})`

      return <div style={{ background, zIndex }} key={`preview-layer-${index}`} className="layer" />
    } else {
      return <div style={{ background: "transparent" }} key={`preview-layer-${index}`} className="layer" />
    }
  })

  return (
    <div className="color preview" onDoubleClick={onDoubleClick}>
      <div className="transparent" />
      {layers}
    </div>
  )
}

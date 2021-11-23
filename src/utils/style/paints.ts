import chroma from "chroma-js"
import { TextProperties } from "models"

export interface Stop {
  offset: string
  color: string
}

export const convertGradientStops = {
  fromFigma: (gradientStops: ColorStop[]): Stop[] =>
    gradientStops.map(({ position, color: _c }) => ({
      offset: position.toString(),

      color: (_rgba => `rgba(${_rgba.join(",")})`)(chroma(_c.r, _c.g, _c.b, _c.a, "gl").rgba()),
    })),

  toFigma: (gradientStops: Stop[]): ColorStop[] =>
    gradientStops.map(({ offset, color }) => ({
      color: (([r, g, b, a]) => ({ r, g, b, a }))(chroma(color).gl()),
      position: parseFloat(offset),
    })),
}

export const convertGradientAngle = {
  toMatrix: (angleDeg: number): Transform =>
    (angle =>
      [
        [Math.cos(angle), Math.sin(angle), 0],
        [-Math.sin(angle), Math.cos(angle), 0],
      ] as any)(((angleDeg - 90) * Math.PI) / 180),

  fromMatrix: (gradientTransform: Transform): number => Math.asin(gradientTransform[0][1]) * (180 / Math.PI) + 90,
}

export const paintToCss = {
  gradient: (angle: Transform, stops: ColorStop[]) => {
    const _angle = convertGradientAngle.fromMatrix(angle)

    const _stops = stops.map(stop => {
      const {
        color: { r, g, b, a },
      } = stop

      const alpha = parseFloat(a.toFixed(2))

      const position = (stop.position * 100).toFixed(0)
      const _color = chroma(r, g, b, alpha, "gl")
      const color = alpha < 1 ? _color.css() : _color.hex()

      return `${color} ${position}%`
    })

    return `linear-gradient(${_angle.toFixed(0)}deg, ${_stops.join(", ")})`
  },

  solid: (paint: SolidPaint) => {
    const {
      color: { r, g, b },
      opacity: a,
    } = paint

    const alpha = parseFloat(a.toFixed(2))
    const color = chroma(r, g, b, alpha, "gl")

    return alpha < 1 ? color.css() : color.hex()
  },
}

export const createSolidPaint = (color = "#000"): SolidPaint => {
  const [r, g, b, opacity] = chroma(color).gl()

  return {
    blendMode: "NORMAL",
    color: { r, g, b },
    visible: true,
    type: "SOLID",
    opacity,
  }
}

export const createTextProperties = (
  family = "Roboto",
  style = "Regular",
  options?: Partial<Omit<TextProperties, "fontName">>,
): TextProperties =>
  Object.assign(
    {
      letterSpacing: { unit: "PERCENT", value: 0 },
      lineHeight: { unit: "AUTO" },
      fontName: { family, style },
      textDecoration: "NONE",
      textCase: "ORIGINAL",
      paragraphSpacing: 0,
      paragraphIndent: 0,
      fontSize: 14,
    },
    options,
  )

export const createGradientStop = {
  forFigma: (position: number, color: string): ColorStop => {
    const solid = createSolidPaint(color)

    return {
      position,
      color: {
        ...solid.color,
        a: solid.opacity,
      },
    }
  },
}

export const createGradientLinear = (angleDeg?: number, stops?: Stop[]): GradientPaint => {
  const _stops = [createGradientStop.forFigma(0, "#000"), createGradientStop.forFigma(1, "#FFF")]

  const gradientStops = stops ? convertGradientStops.toFigma(stops) : _stops

  return {
    type: "GRADIENT_LINEAR",
    blendMode: "NORMAL",
    visible: true,
    opacity: 1,

    gradientTransform: convertGradientAngle.toMatrix(angleDeg || 0),
    gradientStops,
  }
}

export const createDraftPaint = (paintType: "SOLID" | "GRADIENT_LINEAR"): Paint => {
  if (paintType === "SOLID") {
    return createSolidPaint()
  } else {
    return createGradientLinear()
  }
}

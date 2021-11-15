// Adopted gradient parser from stackoverflow by `Dean Taylor`
// https://stackoverflow.com/questions/20215440/parse-css-gradient-rule-with-javascript-regex
import chroma from "chroma-js"

import { paints } from "utils/style"

interface GradientResult {
    colorStopList: paints.Stop[],
    original: string,

    angle?: {
        degrees: number,
        radians: number,
    },
}

export function combineRegExp(list: (RegExp | string)[], flags: string) {
  const source = list.reduce((source, exp) => {
    if (typeof exp === "string") {
      source += exp
    } else if (exp instanceof RegExp) {
      source += exp.source
    }

    return source
  }, "")

  return new RegExp(source, flags)
}

const parserExpression = (() => {
  // Note any variables with "Capture" in name include capturing bracket set(s).
  const searchFlags = "gi", // ignore case for angles, "rgb" etc
    rAngle = /(?:[+-]?\d*\.?\d+)(?:deg|rad|turn)/, // Angle +ive, -ive and angle types
    rSideCornerCapture = /to\s+((?:(?:left|right)(?:\s+(?:top|bottom))?))/, // optional 2nd part
    rComma = /\s*,\s*/, // Allow space around comma.
    /* eslint-disable-next-line */
    rColorHex = /\#(?:[a-f0-9]{6}|[a-f0-9]{3})/, // 3 or 6 character form
    rDigits3 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*\)/,// "(1, 2, 3)"
    rDigits4 = /\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*\d*\.?\d+\)/,// "(1, 2, 3, 4)"
    rValue = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/,// ".9", "-5px", "100%".
    rKeyword = /[_a-z-][_a-z0-9-]*/,// "red", "transparent", "border-collapse".
    rColor = combineRegExp(["(?:", rColorHex, "|", "(?:rgb|hsl)", rDigits3, "|", "(?:rgba|hsla)", rDigits4, "|", rKeyword, ")"], ""),
    rColorStop = combineRegExp([rColor, "(?:\\s+", rValue, "(?:\\s+", rValue, ")?)?"], ""),// Single Color Stop, optional %, optional length.
    rColorStopList = combineRegExp(["(?:", rColorStop, rComma, ")*", rColorStop], ""),// List of color stops min 1.
    rLineCapture = combineRegExp(["(?:(", rAngle, ")|", rSideCornerCapture, ")"], ""),// Angle or SideCorner
    rGradientSearch = combineRegExp(["(?:(", rLineCapture, ")", rComma, ")?(", rColorStopList, ")"], searchFlags),// Capture 1:"line", 2:"angle" (optional), 3:"side corner" (optional) and 4:"stop list".
    rColorStopSearch = combineRegExp(["\\s*(", rColor, ")", "(?:\\s+", "(", rValue, "))?", "(?:", rComma, "\\s*)?"], searchFlags)// Capture 1:"color" and 2:"position" (optional).

  return {
    gradientSearch: rGradientSearch,
    colorStopSearch: rColorStopSearch
  }
})()

// Maybe corner or angle in rad or deg
const getAngle = (angle?: string) => {
  const result = {
    degrees: 0,
    radians: 0,
  }

  if (angle) {
    if (/(deg|rad|turn)/.test(angle)) {
      const angleType = angle.match(/(deg|rad|turn)/)[0]
      const value = parseFloat(angle.replace(angleType, ""))

      if (angleType === "deg") {
        result.radians = value * Math.PI / 180
        result.degrees = value
      } else if (angleType === "rad") {
        result.degrees = Math.floor(value / (Math.PI / 180))
        result.radians = value
      } else if (angleType === "turn") {
        result.degrees = value * 360
        result.radians = result.degrees * Math.PI / 180
      }
    } else {
      throw new Error("Corners not suppoerted, only radians, degrees, and turn")
    }
  }

  return result
}

export function parseGradient(input: string): GradientResult | undefined {
  // reset search position, because we reuse regex.
  parserExpression.gradientSearch.lastIndex = 0
  const matchGradient: RegExpExecArray | undefined = parserExpression.gradientSearch.exec(input)

  if (!matchGradient) {
    return undefined
  }

  const result: GradientResult = {
    original: matchGradient[0],
    colorStopList: []
  }

  const _sideCorner = matchGradient[3]
  const _angle = matchGradient[2]

  const angle = getAngle(_angle || _sideCorner)
  result.angle = angle

  // reset search position, because we reuse regex.
  parserExpression.colorStopSearch.lastIndex = 0

  // Loop though all the color-stops.
  let matchColorStop = parserExpression.colorStopSearch.exec(matchGradient[4])

  while (matchColorStop !== null) {
    const stopResult: paints.Stop = {
      color: chroma(matchColorStop[1]).css(),
      offset: (0).toString(),
    }

    // Position (optional).
    if (matchColorStop[2]) {
      // Pixels dont support
      if (matchColorStop[2].includes("%")) {
        const offset = parseInt(matchColorStop[2])
        stopResult.offset = (offset / 100).toFixed(2)
      } else {
        throw new Error("Pixels in stops like `#FFF 100px` dont support")
      }
    }

    result.colorStopList.push(stopResult)

    // Continue searching from previous position.
    matchColorStop = parserExpression.colorStopSearch.exec(matchGradient[4])
  }

  return result
}

export function test_gradient_paser() {
  const testSubjects = [
    "linear-gradient(180deg, rgba(77, 171, 77, 1) 0%, rgba(250, 255, 0, 1) 100%)",
    // Sample to test optional gradient line
    "linear-gradient(#FF0000 0%, #00FF00 50%, rgb(0, 0, 255) 100%)",
    // Angle, named colors
    "linear-gradient(45deg, red, blue)",
    // Gradient that starts at 60% of the gradient line
    "linear-gradient(135deg, orange, orange 60%, cyan)",
  ]

  const result = testSubjects.map((expression) => {
    // Captures inside brackets - max one additional inner set.
    /* eslint-disable-next-line */
    const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/
    const match = rGradientEnclosedInBrackets.exec(expression)

    if (match) {
      // Get the parameters for the gradient
      try {
        const res = parseGradient(match[1])
        return res
      } catch (e) {
        return undefined
      }
    } else {
      return undefined
    }
  })

  console.log("parsed", result)
}

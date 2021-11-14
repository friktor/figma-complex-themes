import { styleNames } from "utils/style"
import { RawStyle } from "models"

const { assign } = Object

export const updateStylename = (style: RawStyle, names) => {
  assign(style.base, names)
  const { theme, group, name } = style.base
  style.base.fullname = styleNames.generate(theme, group, name)
  return style
}

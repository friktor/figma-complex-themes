const nameMatchers = {
  themes: /\[(\w+|\w+:\w+)\]/,
  group: /^(\w+)\/(.*)$/,
}

interface ParsedStylename {
  theme?: string
  group?: string
  name: string
}

export const parse = (fullname: string): ParsedStylename => {
  let result: any = {}

  const _names = _name => {
    if (nameMatchers.group.test(_name)) {
      const [$_, group, name] = _name.match(nameMatchers.group)

      return {
        group,
        name,
      }
    } else {
      return {
        name: _name,
      }
    }
  }

  if (nameMatchers.themes.test(fullname)) {
    const [$themeFull, theme] = fullname.match(nameMatchers.themes)
    result.theme = theme

    const names = _names(fullname.replace($themeFull, "").replace(" ", ""))

    if (names) {
      result = Object.assign({}, result, names)
    }
  } else {
    const names = _names(fullname.replace(" ", ""))

    if (names) {
      result = Object.assign({}, result, names)
    }
  }

  return result
}

export const generate = (theme?: string, group?: string, name?: string) => {
  const _theme = theme ? `[${theme}]` : ""
  const _group = group || "Temp"
  const _style = name || "Untitled"

  return `${_group}${_theme}/${_style}`
}
